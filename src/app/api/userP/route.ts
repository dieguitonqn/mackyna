import { NextResponse } from "next/server";
import argon2 from "argon2";
import { ObjectId } from "mongodb";
import User from "@/lib/models/user";

export const PUT = async (req: Request) => {
    try {
        const { _id, pwd } = await req.json();
        console.log(_id, pwd)
        const hashedPassword = await argon2.hash(pwd);
        console.log(hashedPassword);
        const newPwd = await User.findByIdAndUpdate({ _id: new ObjectId(_id as string) }, { pwd: hashedPassword }, { new: true });
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