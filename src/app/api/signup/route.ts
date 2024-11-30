
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import  argon2 from "argon2";


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
        const body = await req.json();
        await connect();
        const existingUser = await User.findOne(

            { email: body.email },


        );

        if (existingUser) {
            return new NextResponse(JSON.stringify({ message: "Usuario ya existe" }), { status: 409 }); // Conflicto
        }

        // Hashear la contraseña con Argon2
        const hashedPassword = await argon2.hash(body.pwd);
        // Crear un nuevo usuario
        const newUser = new User({
            ...body,
            pwd: hashedPassword, // Guardar la contraseña hasheada
        });

        // Guardar el usuario en la base de datos
        await newUser.save();

        return new NextResponse(JSON.stringify({ message: "recibido ok" }), { status: 200 })
    } catch (error: unknown) {

        if(error instanceof Error){
            return new NextResponse("error:" + error.message)
        }
        return new NextResponse("Error: "+ error, {status:500})

    }
}

