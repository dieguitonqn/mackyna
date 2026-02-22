import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { authOptions } from "@/lib/auth0";
import { getServerSession } from "next-auth";
import Ejercicio from "@/lib/models/ejercicios";

export const GET = async (req: Request): Promise<NextResponse> => {
    
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
        return new NextResponse("No autorizado", { status: 401 });
    }
    try {
        await connect();
        const gruposMusc : string[] = await Ejercicio.distinct("grupoMusc");
        return new NextResponse(JSON.stringify(gruposMusc), { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error: " + error.message, { status: 500 });
        }
        return new NextResponse("Error desconocido", { status: 500 });
    }
};