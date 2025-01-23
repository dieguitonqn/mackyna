import connect from "@/lib/db";
import User from "@/lib/models/user";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth0";
import { getServerSession } from "next-auth";
import { NextRequest } from 'next/server';
import logger from '@/lib/logger';

export const GET = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            logger.error("[GET] Error de autenticación: Usuario no autorizado");
            return new NextResponse("No autorizado", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const _id = searchParams.get("id");

        await connect();
        logger.info("[GET] Conexión a DB establecida");

        if (_id) {
            if (!ObjectId.isValid(_id)) {
                logger.error(`[GET] ID inválido: ${_id}`);
                return new NextResponse("El ID no es válido", { status: 400 });
            }

            const user = await User.findById(new ObjectId(_id));
            if (!user) {
                logger.error(`[GET] Usuario no encontrado con ID: ${_id}`);
                return new NextResponse("Usuario no encontrado", { status: 404 });
            }

            logger.info(`[GET] Usuario encontrado: ${user.email}`);
            return new NextResponse(JSON.stringify(user), { status: 200 });
        }

        const users = await User.find().sort({nombre:1,apellido:1});
        logger.info(`[GET] Recuperados ${users.length} usuarios`);
        return new NextResponse(JSON.stringify(users), { status: 200 });

    } catch (error: unknown) {
        logger.error("[GET] Error:", { error: error instanceof Error ? error.message : error });
        return new NextResponse("Error interno del servidor", { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            logger.error("[POST] Error de autenticación: Usuario no autorizado");
            return new NextResponse("No autorizado", { status: 401 });
        }

        await connect();
        logger.info("[POST] Conexión a DB establecida");

        const { email } = await req.json();
        if (!email) {
            logger.error("[POST] Email no proporcionado");
            return new NextResponse("El email es obligatorio", { status: 400 });
        }

        const user = await User.findOne({ email });
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
        const session = await getServerSession(authOptions);
        if(!session){
            logger.error("[PUT] Error de autenticación: Usuario no autorizado");
            return new NextResponse("No autorizado", { status: 401 });
        }

        await connect();
        logger.info("[PUT] Conexión a DB establecida");

        const { _id, ...rest } = await req.json();
        const userId = new ObjectId(_id as string);

        if (!rest.email) {
            logger.error("[PUT] Email no proporcionado");
            return new NextResponse("El email es obligatorio", { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, rest, { new: true });
        if (!updatedUser) {
            logger.error(`[PUT] Usuario no encontrado con ID: ${_id}`);
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }

        logger.info(`[PUT] Usuario actualizado: ${updatedUser.email}`);
        return new NextResponse(JSON.stringify(updatedUser), { status: 200 });

    } catch (error: unknown) {
        logger.error("[PUT] Error:", { error: error instanceof Error ? error.message : error });
        return new NextResponse("Error interno del servidor", { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            logger.error("[DELETE] Error de autenticación: Usuario no autorizado");
            return new NextResponse("No autorizado", { status: 401 });
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

        const deletedUser = await User.findByIdAndDelete(new ObjectId(id));
        if (!deletedUser) {
            logger.error(`[DELETE] Usuario no encontrado con ID: ${id}`);
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        logger.info(`[DELETE] Usuario eliminado: ${deletedUser.email}`);
        return NextResponse.json({ message: "Usuario eliminado con éxito", user: deletedUser }, { status: 200 });

    } catch (error: unknown) {
        logger.error("[DELETE] Error:", { error: error instanceof Error ? error.message : error });
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
};