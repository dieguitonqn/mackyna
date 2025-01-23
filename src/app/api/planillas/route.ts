import connect from "@/lib/db";
import Plani from "@/lib/models/planillas";
import User from "@/lib/models/user";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth0";
import { getServerSession } from "next-auth";


export const GET = async (req: Request) => {
    const session = await getServerSession({ req, ...authOptions });
        if(!session){
            return new NextResponse("No autorizado", { status: 401 });
        }
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("id");
  

    try {
        await connect();

        // Si se proporciona un `id`, buscar el ejercicio específico
        if (_id) {


            if (!ObjectId.isValid(_id)) {
                return new NextResponse("El ID no es válido", { status: 400 });
            }

            const planillas = await Plani.find({ userId: _id });

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


export const POST = async (req: Request) => {
    const session = await getServerSession({ req, ...authOptions });
        if(!session){
            console.log("No autorizado");
            return new NextResponse("No autorizado", { status: 401 });
        }
    try {
        await connect();
        const planilla = await req.json();
        console.log(planilla);
        const newPlanilla = await Plani.create(planilla);

        if (!newPlanilla) {
            return new NextResponse("No se pudo ingresar el entreno", { status: 400 });

        }
        const ultima_planilla = await User.findByIdAndUpdate({ _id: new ObjectId(planilla.userId as string) }, { ultima_plani: Date.now() }, { new: true });
        if (!ultima_planilla) {
            return new NextResponse("No se pudo actualizar la fecha de la ultima planilla", { status: 400 });
        }   
        return new NextResponse("ejercicio agregado con exito", { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error);
            return NextResponse.json({ error: "Error: " + error.message }, { status: 500 });
        }
        console.log(error);
        return NextResponse.json({ error: "Error desconocido" }, { status: 500 });
    }
}

export const DELETE = async (req: Request): Promise<NextResponse>=>{
    const session = await getServerSession({ req, ...authOptions });
        if(!session){
            return new NextResponse("No autorizado", { status: 401 });
        }
   
    try {
        await connect();
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        // Validar que se proporcione el ID
        if (!id) {
            return NextResponse.json({ error: "El ID es obligatorio" }, { status: 400 });
        }

        // Validar formato del ObjectId
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "El ID proporcionado no es válido" }, { status: 400 });
        }
         
        const deletedRoutine = await Plani.findByIdAndDelete(new ObjectId(id));
        if(!deletedRoutine){
            return NextResponse.json({error:"Rutina no encontrada"},{status:404});
        }

        return NextResponse.json({ messaje:"Rutina eliminada"}, { status: 200 })
    }
    catch (error: unknown) {
        return NextResponse.json({ error: "Ejercicio no encontrado" +error}, { status: 404 });
}
}


export const PUT = async (req:Request):Promise<NextResponse>=>{
    const session = await getServerSession({ req, ...authOptions });
        if(!session){
            return new NextResponse("No autorizado", { status: 401 });
        }
    try {
        const {id,plani} = await req.json();
        
        // Validar formato del ObjectId
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "El ID proporcionado no es válido" }, { status: 400 });
        }

        const editedPlani = await Plani.findByIdAndUpdate(new ObjectId(id), plani);
        if(!editedPlani){
            return NextResponse.json({message:"No se pudo editar la planilla"},{status: 501});
        }

        return NextResponse.json({message:"todo ok"},{status:200});
        
    } catch (error:unknown) {
        return NextResponse.json({error:error},{status:501});
    }

}