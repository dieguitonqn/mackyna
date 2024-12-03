import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {

        await connect();
        const users = await User.find();

        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("error: " + error.message, { status: 500 });
        }

    }
}



export const POST = async (req: Request) => {
    try {
        await connect();

        // Parsear el cuerpo de la solicitud
        const { email } = await req.json();

        if (!email) {
            return new NextResponse("El email es obligatorio", { status: 400 });
        }

        // Buscar usuario por email
        const user = await User.findOne({ email });

        if (!user) {
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }

        return new NextResponse(JSON.stringify(user), { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error: " + error.message, { status: 500 });
        }
    }
};


export const PUT = async (req: Request) => {
    try {
        await connect();

        const { email, nombre, apellido, rol } = await req.json();
        console.log(rol);

        if (!email) {
            return new NextResponse("El email es obligatorio", { status: 400 });
        }

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { nombre, apellido, rol },
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }

        return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error: " + error.message, { status: 500 });
        }
    }
};