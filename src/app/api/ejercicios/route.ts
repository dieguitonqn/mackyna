import connect from "@/lib/db";
import Ejercicio from "@/lib/models/ejercicios";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getActiveSession } from "@/lib/getActiveSession";

const isStaff = (session: Awaited<ReturnType<typeof getActiveSession>>) =>
    ['admin', 'teacher', 'teach'].includes(session?.user?.rol ?? '');




export const GET = async (req: Request) => {
    const session = await getActiveSession(req);
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

            const ejercicio = await Ejercicio.findById(new ObjectId(_id));

            if (!ejercicio) {
                return new NextResponse("Ejercicio no encontrado", { status: 404 });
            }

            return new NextResponse(JSON.stringify(ejercicio), { status: 200 });
        }

        //     // Si no hay `id`, devolver todos los ejercicios
        const ejercicios = await Ejercicio.find().sort({ nombre: 1 });
        return new NextResponse(JSON.stringify(ejercicios), { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error: " + error.message, { status: 500 });
        }
    }
};

export const POST = async (req: Request) => {
    const session = await getActiveSession(req);
    if(!session){
        return new NextResponse("No autorizado", { status: 401 });
    }
    if (!isStaff(session)) {
        return new NextResponse("No autorizado", { status: 403 });
    }
    try {
        await connect();

        // Parsear el cuerpo de la solicitud
        const body = await req.json();
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return new NextResponse("Datos de ejercicio inválidos", { status: 400 });
        }
        const { nombre, grupoMusc, specificMusc, description, video } = body;
        if (
            typeof nombre !== 'string' || !nombre.trim() || nombre.length > 150 ||
            typeof specificMusc !== 'string' || !specificMusc.trim() || specificMusc.length > 150 ||
            (grupoMusc !== undefined && typeof grupoMusc !== 'string') ||
            (description !== undefined && typeof description !== 'string') ||
            (video !== undefined && typeof video !== 'string') ||
            (description?.length ?? 0) > 2000 || (video?.length ?? 0) > 2000 || (grupoMusc?.length ?? 0) > 150
        ) {
            return new NextResponse("Datos de ejercicio inválidos", { status: 400 });
        }

        // Crear ejercicio
        const newEjercicio = await Ejercicio.create({
            nombre: nombre.trim(),
            grupoMusc: grupoMusc?.trim(),
            specificMusc: specificMusc.trim(),
            description,
            video,
        });

        if (!newEjercicio) {
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }
        return new NextResponse("ejercicio agregado con exito",{status: 200});
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: "Error: " + error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Error desconocido" }, { status: 500 });
    }
};



export const PUT = async (req: Request) => {
    const session = await getActiveSession(req);
    if(!session){
        return new NextResponse("No autorizado", { status: 401 });
    }
    if (!isStaff(session)) {
        return new NextResponse("No autorizado", { status: 403 });
    }
    try {
        await connect();

        const body = await req.json();
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return new NextResponse("Datos de ejercicio inválidos", { status: 400 });
        }
        const { _id, nombre, grupoMusc, specificMusc, description, video } = body;
        // console.log(rol);

        if (typeof _id !== 'string' || !ObjectId.isValid(_id)) {
            return new NextResponse("El ID no es válido", { status: 400 });
        }
        if (
            typeof nombre !== 'string' || !nombre.trim() || nombre.length > 150 ||
            typeof specificMusc !== 'string' || !specificMusc.trim() || specificMusc.length > 150 ||
            (grupoMusc !== undefined && typeof grupoMusc !== 'string') ||
            (description !== undefined && typeof description !== 'string') ||
            (video !== undefined && typeof video !== 'string') ||
            (description?.length ?? 0) > 2000 || (video?.length ?? 0) > 2000 || (grupoMusc?.length ?? 0) > 150
        ) {
            return new NextResponse("Datos de ejercicio inválidos", { status: 400 });
        }
        // const idObject = new ObjectId(_id);
        const updatedEjercicio = await Ejercicio.findOneAndUpdate(
            // {  idObject },
            new ObjectId(_id),
            {
                nombre: nombre.trim(),
                grupoMusc: grupoMusc?.trim(),
                specificMusc: specificMusc.trim(),
                description,
                video,
            },
            { new: true, runValidators: true }
        );

        if (!updatedEjercicio) {
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }

        return new NextResponse(JSON.stringify(updatedEjercicio), { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error: " + error.message, { status: 500 });
        }
    }
};


export const DELETE = async (req: Request): Promise<NextResponse> => {
    const session = await getActiveSession(req);
    if(!session){
        return new NextResponse("No autorizado", { status: 401 });
    }
    if (!isStaff(session)) {
        return new NextResponse("No autorizado", { status: 403 });
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
        const deletedEjercicio = await Ejercicio.findByIdAndDelete(new ObjectId(id));

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
