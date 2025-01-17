import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import User from "@/lib/models/user";
import { authOptions } from "@/lib/auth0";
import { getServerSession } from "next-auth";

export const PUT = async (req: Request) => {
    const session = await getServerSession({ req, ...authOptions });
            if(!session){
                return new NextResponse("No autorizado", { status: 401 });
            }
    try {
        const { userID, dias_permitidos } = await req.json();
        console.log(userID, dias_permitidos)
        
        
        const newCupoDias = await User.findByIdAndUpdate({ _id: new ObjectId(userID as string) }, { dias_permitidos: dias_permitidos }, { new: true });
        if(!newCupoDias){
            return new NextResponse("No se pudo cambiar los dias disponibles", { status: 404 });
        }
        return new NextResponse("Actualizado con éxito", { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error: " + error.message, { status: 500 });
        }

    }
}