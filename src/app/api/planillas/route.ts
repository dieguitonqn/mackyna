import connect from "@/lib/db";
import Plani from "@/lib/models/planillas";
// import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("id");
    try {
        await connect();

        // Si se proporciona un `id`, buscar el ejercicio específico
        if (_id) {


            // if (!ObjectId.isValid(_id)) {
            //     return new NextResponse("El ID no es válido", { status: 400 });
            // }

            const planillas = await Plani.find({userId:_id});

            if (!planillas) {
                return new NextResponse("Usuario no encontrado", { status: 404 });
            }
            return new NextResponse(JSON.stringify(planillas), { status: 201 });
        }

        //     // Si no hay `id`, devolver todos los users
        const planillas = await Plani.find();
        return new NextResponse(JSON.stringify(planillas), { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error: " + error.message, { status: 500 });
        }
    }
};