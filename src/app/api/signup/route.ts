
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";


export const GET = async () => {
    try {
        
        await connect();
        const users = await User.find();
        
        return new NextResponse(JSON.stringify(users), {status:200});
    } catch (error:any) {
        return new NextResponse("error:"+error.message,{status:500})

    }
}


export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        console.log(body);
        await connect();
       const existingUser = await User.findOne({
            $or: [
                { email: body.email },

            ],
        });

        if (existingUser) {
            return new NextResponse(JSON.stringify({ message: "Usuario ya existe" }), { status: 409 }); // Conflicto
        }
        const newUser = new User(body);
        await newUser.save();
        return new NextResponse(JSON.stringify({message:"recibido ok"}), {status:200})
    } catch (error:any) {
        return new NextResponse("error:"+error.message)

    }
}

