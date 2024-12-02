import connect from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

export  const GET = async () => {
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