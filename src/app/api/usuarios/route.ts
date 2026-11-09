import connect from "@/lib/db";
import User from "@/lib/models/user";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { getActiveSession } from "@/lib/getActiveSession";
import { NextRequest } from 'next/server';
import logger from '@/lib/logger';
import { parseDateOnlyToUTC } from '@/utils/dateOnly';
import { recordAdminEvent } from '@/lib/adminEvents';

const isStaff = (session: Session | null) =>
    ['admin', 'teacher', 'teach'].includes(session?.user?.rol ?? '');

const isAdmin = (session: Session | null) =>
    session?.user?.rol === 'admin';

const safeUserFields = '-pwd';

const normalizeGenero = (value: unknown): string => {
    if (typeof value !== 'string') {
        return '';
    }

    const trimmed = value.trim().toLowerCase();

    if (trimmed === 'masculino') {
        return 'Masculino';
    }

    if (trimmed === 'femenino') {
        return 'Femenino';
    }

    if (trimmed === 'otro') {
        return 'Otro';
    }

    return value;
};

const normalizeBirthDate = (value: unknown): Date | null => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    if (typeof value !== 'string') {
        return null;
    }

    const dateOnly = parseDateOnlyToUTC(value);
    if (dateOnly) {
        return dateOnly;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed;
};

export const GET = async (req: NextRequest) => {
    try {
        const session = await getActiveSession(req);
        if(!session){
            logger.error("[GET] Error de autenticación: Usuario no autorizado");
            return new NextResponse("No autorizado", { status: 401 });
        }

        const canManageUsers = isStaff(session);

        const { searchParams } = new URL(req.url);
        const _id = searchParams.get("id");

        await connect();
        logger.info("[GET] Conexión a DB establecida");

        if (_id) {
            if (!ObjectId.isValid(_id)) {
                logger.error(`[GET] ID inválido: ${_id}`);
                return new NextResponse("El ID no es válido", { status: 400 });
            }

            if (_id !== session.user.id?.toString() && !canManageUsers) {
                return new NextResponse("No autorizado", { status: 403 });
            }

            const user = await User.findById(new ObjectId(_id)).select(safeUserFields);
            if (!user) {
                logger.error(`[GET] Usuario no encontrado con ID: ${_id}`);
                return new NextResponse("Usuario no encontrado", { status: 404 });
            }

            logger.info(`[GET] Usuario encontrado: ${user.email}`);
            return new NextResponse(JSON.stringify(user), { status: 200 });
        }

        if (!canManageUsers) {
            return new NextResponse("No autorizado", { status: 403 });
        }

        const users = await User.find().select(safeUserFields).sort({nombre:1,apellido:1});
        logger.info(`[GET] Recuperados ${users.length} usuarios`);
        return new NextResponse(JSON.stringify(users), { status: 200 });

    } catch (error: unknown) {
        logger.error("[GET] Error:", { error: error instanceof Error ? error.message : error });
        return new NextResponse("Error interno del servidor", { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const session = await getActiveSession(req);
        if(!session){
            logger.error("[POST] Error de autenticación: Usuario no autorizado");
            return new NextResponse("No autorizado", { status: 401 });
        }

        if (!isStaff(session)) {
            return new NextResponse("No autorizado", { status: 403 });
        }

        await connect();
        logger.info("[POST] Conexión a DB establecida");

        const { email } = await req.json();
        if (!email) {
            logger.error("[POST] Email no proporcionado");
            return new NextResponse("El email es obligatorio", { status: 400 });
        }

        const user = await User.findOne({ email }).select(safeUserFields);
        if (!user) {
            logger.error(`[POST] Usuario no encontrado con email: ${email}`);
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }

        logger.info(`[POST] Usuario encontrado: ${user.email}`);
        return new NextResponse(JSON.stringify(user), { status: 200 });

    } catch (error: unknown) {
        logger.error("[POST] Error:", { error: error instanceof Error ? error.message : error });
        return new NextResponse("Error interno del servidor", { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        const session = await getActiveSession(req);
        if(!session){
            logger.error("[PUT] Error de autenticación: Usuario no autorizado");
            return new NextResponse("No autorizado", { status: 401 });
        }

        if (!isStaff(session)) {
            return new NextResponse("No autorizado", { status: 403 });
        }

        await connect();
        logger.info("[PUT] Conexión a DB establecida");

        const body: unknown = await req.json();
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return new NextResponse("Datos inválidos", { status: 400 });
        }
        const { _id, ...rest } = body as Record<string, unknown>;

        if (!_id || !ObjectId.isValid(_id as string)) {
            logger.error(`[PUT] ID inválido: ${_id}`);
            return new NextResponse("El ID no es válido", { status: 400 });
        }

        const userId = new ObjectId(_id as string);
        const targetUser = await User.findById(userId).select('rol email pendingEmail');
        if (!targetUser) {
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }
        if (!isAdmin(session) && targetUser.rol !== 'user') {
            return new NextResponse("Solo un administrador puede editar cuentas del personal", { status: 403 });
        }

        const allowedFields = [
            'nombre', 'apellido', 'email', 'genero', 'fecha_nacimiento',
            'localidad', 'telefono', 'altura', 'objetivo', 'lesiones', 'redes',
            'rol',
        ] as const;
        const payload: Record<string, unknown> = {};
        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(rest, field)) {
                payload[field] = rest[field];
            }
        }

        if ('rol' in payload && !isAdmin(session)) {
            const currentUser = await User.findById(userId).select('rol');
            if (!currentUser || payload.rol !== currentUser.rol) {
                return new NextResponse("Solo un administrador puede cambiar roles", { status: 403 });
            }
            delete payload.rol;
        }

        if (Object.prototype.hasOwnProperty.call(payload, 'fecha_nacimiento')) {
            const normalizedBirthDate = normalizeBirthDate(payload.fecha_nacimiento);
            const isEmptyBirthDate = payload.fecha_nacimiento === '' || payload.fecha_nacimiento === null;

            if (!normalizedBirthDate && !isEmptyBirthDate) {
                logger.error(`[PUT] Fecha de nacimiento inválida: ${payload.fecha_nacimiento}`);
                return new NextResponse("Fecha de nacimiento inválida", { status: 400 });
            }

            payload.fecha_nacimiento = normalizedBirthDate;
        }

        if (Object.prototype.hasOwnProperty.call(payload, 'genero')) {
            payload.genero = normalizeGenero(payload.genero);
        }

        if (typeof payload.email !== 'string') {
            logger.error("[PUT] Email no proporcionado");
            return new NextResponse("El email es obligatorio", { status: 400 });
        }

        const requestedEmail = payload.email.trim().toLowerCase();
        if (
            requestedEmail.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestedEmail)
        ) {
            return new NextResponse("El email no es válido", { status: 400 });
        }

        const currentEmail = targetUser.email.trim().toLowerCase();
        const emailChanged = requestedEmail !== currentEmail;
        let emailChangePending = false;
        if (emailChanged) {
            const emailInUse = await User.findOne({
                _id: { $ne: userId },
                $or: [{ email: requestedEmail }, { pendingEmail: requestedEmail }],
            }).collation({ locale: 'en', strength: 2 }).select('_id');
            if (emailInUse) {
                return new NextResponse("El email ya está asociado a otra cuenta", { status: 409 });
            }

            if (targetUser.rol === 'user') {
                if ('rol' in payload && payload.rol !== 'user') {
                    return new NextResponse("No se puede cambiar el rol mientras hay un cambio de email pendiente", { status: 400 });
                }
                delete payload.email;
                payload.pendingEmail = requestedEmail;
                payload.emailChangeRequestedBy = session.user?.id?.toString() ?? '';
                payload.emailChangeRequestedAt = new Date();
                emailChangePending = true;
            } else {
                payload.email = requestedEmail;
            }
        } else {
            // Keep the existing canonical email; only admins may change it for staff accounts.
            payload.email = targetUser.email;
        }

        const update: Record<string, unknown> = { $set: payload };
        if (emailChanged && targetUser.rol !== 'user') {
            update.$unset = {
                pendingEmail: 1,
                emailChangeRequestedBy: 1,
                emailChangeRequestedAt: 1,
            };
        }

        const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true }).select(safeUserFields);
        if (!updatedUser) {
            logger.error(`[PUT] Usuario no encontrado con ID: ${_id}`);
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }

        await recordAdminEvent({
            type: 'admin_action',
            actorId: session.user.id?.toString(),
            targetId: String(updatedUser._id),
            action: 'user_updated',
        });

        logger.info(`[PUT] Usuario actualizado: ${updatedUser.email}; cambio de email pendiente: ${emailChangePending}`);
        return NextResponse.json({
            user: updatedUser,
            emailChangePending,
        }, { status: 200 });

    } catch (error: unknown) {
        logger.error("[PUT] Error:", { error: error instanceof Error ? error.message : error });
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
            return new NextResponse("El email ya está asociado a otra cuenta", { status: 409 });
        }
        return new NextResponse("Error interno del servidor", { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        const session = await getActiveSession(req);
        if(!session){
            logger.error("[DELETE] Error de autenticación: Usuario no autorizado");
            return new NextResponse("No autorizado", { status: 401 });
        }

        if (!isStaff(session)) {
            return new NextResponse("No autorizado", { status: 403 });
        }

        await connect();
        logger.info("[DELETE] Conexión a DB establecida");

        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            logger.error("[DELETE] ID no proporcionado");
            return NextResponse.json({ error: "El ID es obligatorio" }, { status: 400 });
        }

        if (!ObjectId.isValid(id)) {
            logger.error(`[DELETE] ID inválido: ${id}`);
            return NextResponse.json({ error: "El ID proporcionado no es válido" }, { status: 400 });
        }

        const targetUser = await User.findById(new ObjectId(id)).select('rol email');
        if (!targetUser) {
            logger.error(`[DELETE] Usuario no encontrado con ID: ${id}`);
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }
        const isAdminSession = isAdmin(session);
        if (!isAdminSession && targetUser.rol !== 'user') {
            return NextResponse.json({ error: "Solo un administrador puede borrar cuentas del personal" }, { status: 403 });
        }

        const deletedUser = await User.findOneAndDelete(
            isAdminSession ? { _id: new ObjectId(id) } : { _id: new ObjectId(id), rol: 'user' }
        );
        if (!deletedUser) {
            logger.error(`[DELETE] La cuenta cambió durante la eliminación: ${id}`);
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        await recordAdminEvent({
            type: 'admin_action',
            actorId: session.user.id?.toString(),
            targetId: String(deletedUser._id),
            action: 'user_deleted',
        });

        logger.info(`[DELETE] Usuario eliminado: ${deletedUser.email}`);
        return NextResponse.json({ message: "Usuario eliminado con éxito", id: deletedUser._id.toString() }, { status: 200 });

    } catch (error: unknown) {
        logger.error("[DELETE] Error:", { error: error instanceof Error ? error.message : error });
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
};

export async function PATCH(req: Request) {
    try {
        const session = await getActiveSession(req);
        if (!session) {
            return new NextResponse("No autorizado", { status: 401 });
        }
        if (!isStaff(session)) {
            return new NextResponse("No autorizado", { status: 403 });
        }

        await connect();
        const { userId, habilitado } = await req.json();

        if (typeof userId !== 'string' || !ObjectId.isValid(userId) || typeof habilitado !== 'boolean') {
            return new NextResponse("Datos inválidos", { status: 400 });
        }
        
        const targetUser = await User.findById(userId).select('rol');
        if (!targetUser) {
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }
        const isAdminSession = isAdmin(session);
        if (!isAdminSession && targetUser.rol !== 'user') {
            return new NextResponse("Solo un administrador puede cambiar el estado de cuentas del personal", { status: 403 });
        }

        const updatedUser = await User.findOneAndUpdate(
            isAdminSession ? { _id: new ObjectId(userId) } : { _id: new ObjectId(userId), rol: 'user' },
            { habilitado },
            { new: true }
        );

        if (!updatedUser) {
            return new Response('Usuario no encontrado', { status: 404 });
        }

        await recordAdminEvent({
            type: 'admin_action',
            actorId: session.user.id?.toString(),
            targetId: String(updatedUser._id),
            action: habilitado ? 'account_enabled' : 'account_disabled',
        });

        return NextResponse.json({ id: updatedUser._id.toString(), habilitado: updatedUser.habilitado }, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return new Response('Error al actualizar usuario', { status: 500 });
    }
}
