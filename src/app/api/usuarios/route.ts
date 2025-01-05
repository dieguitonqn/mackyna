import connect from "@/lib/db";
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

            const user = await User.findById(new ObjectId(_id));

            if (!user) {
                return new NextResponse("Usuario no encontrado", { status: 404 });
            }

            return new NextResponse(JSON.stringify(user), { status: 200 });
        }

        //     // Si no hay `id`, devolver todos los users
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error: " + error.message, { status: 500 });
        }
    }
};


export const POST = async (req: Request) => {
    const session = await getServerSession({ req, ...authOptions });
    if(!session){
        return new NextResponse("No autorizado", { status: 401 });
    }
    try {
        await connect();

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
    const session = await getServerSession({ req, ...authOptions });
    if(!session){
        return new NextResponse("No autorizado", { status: 401 });
    }
    try {
        await connect();
        const { _id, ...rest } = await req.json();


        const userId = new ObjectId(_id as string);


        if (!rest.email) {
            return new NextResponse("El email es obligatorio", { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, rest, { new: true });


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


export const DELETE = async (req: Request): Promise<NextResponse> => {
    const session = await getServerSession({ req, ...authOptions });
    if(!session){
        return new NextResponse("No autorizado", { status: 401 });
    }
    try {
        // Conectar a la base de datos
        await connect();

        // Obtener el _id del query string
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

        // Intentar eliminar el documento
        const deletedEjercicio = await User.findByIdAndDelete(new ObjectId(id));

        // Si no se encuentra el documento
        if (!deletedEjercicio) {
            return NextResponse.json({ error: "Ejercicio no encontrado" }, { status: 404 });
        }

        // Respuesta exitosa
        return NextResponse.json({ message: "Ejercicio eliminado con éxito", ejercicio: deletedEjercicio }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: `Error al eliminar el ejercicio: ${error.message}` }, { status: 500 });
        }
        return NextResponse.json({ error: "Error desconocido al eliminar el ejercicio" }, { status: 500 });
    }
};