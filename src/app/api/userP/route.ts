import { NextResponse } from "next/server";
import argon2 from "argon2";
import { ObjectId } from "mongodb";
import User from "@/lib/models/user";
import { getActiveSession } from "@/lib/getActiveSession";
import connect from "@/lib/db";

export const PUT = async (req: Request) => {
    const session = await getActiveSession(req);
    if (!session) {
        return new NextResponse("No autorizado", { status: 401 });
    }
    if (!['admin', 'teacher', 'teach'].includes(session.user?.rol ?? '')) {
        return new NextResponse("No autorizado", { status: 403 });
    }
    try {
        const { _id, pwd } = await req.json();
        if (typeof _id !== 'string' || !ObjectId.isValid(_id) || typeof pwd !== 'string' || pwd.length < 8 || pwd.length > 128) {
            return new NextResponse("Datos de contraseña inválidos", { status: 400 });
        }
        await connect();
        const targetUser = await User.findById(new ObjectId(_id)).select('rol');
        if (!targetUser) {
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }
        const isAdmin = session.user?.rol === 'admin';
        if (!isAdmin && targetUser.rol !== 'user') {
            return new NextResponse("Solo un administrador puede cambiar contraseñas del personal", { status: 403 });
        }

        const hashedPassword = await argon2.hash(pwd);
        const newPwd = await User.findOneAndUpdate(
            isAdmin ? { _id: new ObjectId(_id) } : { _id: new ObjectId(_id), rol: 'user' },
            { pwd: hashedPassword },
            { new: true }
        );
        if(!newPwd){
            return new NextResponse("No se pudo cambiar la contraseña", { status: 404 });
        }
        return new NextResponse("PUT", { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error: " + error.message, { status: 500 });
        }

    }
}
