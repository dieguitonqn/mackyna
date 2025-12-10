import connect from "@/lib/db";
import Plani from "@/lib/models/planillas";
import User from "@/lib/models/user";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth0";
import { getServerSession } from "next-auth";
import logger from "@/lib/logger";
import { log } from "console";

export const GET = async (req: Request) => {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
        logger.warn('Intento de acceso no autorizado al endpoint GET /api/planillas');
        return new NextResponse("No autorizado", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("id");
    const planiID = searchParams.get("planiID");

    try {
        await connect();

        if (_id) {
            if (!ObjectId.isValid(_id)) {
                logger.warn(`ID inválido proporcionado en GET /api/planillas: ${_id}`);
                return new NextResponse("El ID no es válido", { status: 400 });
            }

            const planillas = await Plani.find({ userId: _id }).sort({ _id: -1 });
            logger.info(`Planillas recuperadas para el usuario ${_id}`);

            if (!planillas) {
                logger.warn(`Usuario no encontrado con ID: ${_id}`);
                return new NextResponse("Usuario no encontrado", { status: 404 });
            }
            return new NextResponse(JSON.stringify(planillas), { status: 201 });
        } else if (planiID) {
            if (!ObjectId.isValid(planiID)) {
                logger.warn(`ID inválido proporcionado en GET /api/planillas: ${planiID}`);
                return new NextResponse("El ID no es válido", { status: 400 });
            }

            const planilla = await Plani.findById(planiID);
            logger.info(`Planilla recuperada con ID: ${planiID}`);

            if (!planilla) {
                logger.warn(`Planilla no encontrada con ID: ${planiID}`);
                return new NextResponse("Planilla no encontrada", { status: 404 });
            }
            return new NextResponse(JSON.stringify(planilla), { status: 200 });
        }

        const planillas = await Plani.find();
        logger.info('Todas las planillas recuperadas exitosamente');
        return new NextResponse(JSON.stringify(planillas), { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`Error en GET /api/planillas: ${error.message}`);
            return new NextResponse("Error: " + error.message, { status: 500 });
        }
    }
};

// Modificar la interfaz para ser más flexible con las repeticiones
// interface ExerciseValidation {
//     name: string;
//     reps: string | number; // Permitir tanto números como texto
//     sets: number;
//     videoLink?: string;
//     notas?: string;
// }

// interface PlanillaValidation {
//     userId: string;
//     exercises: {
//         [key: string]: {
//             [key: string]: ExerciseValidation[];
//         };
//     };
// }

export const POST = async (req: Request) => {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
        logger.warn('Intento de acceso no autorizado al endpoint POST /api/planillas');
        return new NextResponse("No autorizado", { status: 401 });
    }
    logger.info(`Usuario ${session.user?.email} está creando una nueva planilla`);
    
    try {
        await connect();
        const planilla : Plani = await req.json();
        // console.log(planilla.trainingDays[1].Bloque2);
        logger.debug("Datos recibidos para la nueva planilla: ", { planilla });
        // Validación de datos requeridos
        if (!planilla.userId) {
            logger.error('Intento de crear planilla sin userId');
            return NextResponse.json({ error: "userId es requerido" }, { status: 400 });
        }

        // // Validar que exercises exista y tenga la estructura correcta
        // if (!planilla.exercises || typeof planilla.exercises !== 'object') {
        //     logger.error('Intento de crear planilla con estructura de ejercicios inválida');
        //     return NextResponse.json({ error: "Estructura de ejercicios inválida" }, { status: 400 });
        // }

        // // Validar cada ejercicio
        // for (const day in planilla.exercises) {
        //     for (const bloque in planilla.exercises[day]) {
        //         const exercises = planilla.exercises[day][bloque];
        //         if (!Array.isArray(exercises)) {
        //             logger.error(`Estructura inválida de ejercicios para día ${day}, bloque ${bloque}`);
        //             return NextResponse.json({
        //                 error: `Estructura inválida de ejercicios para día ${day}, bloque ${bloque}`
        //             }, { status: 400 });
        //         }

        //         for (const exercise of exercises) {
        //             // Validar que los campos requeridos existan y no estén vacíos
        //             if (!exercise.name || exercise.name.trim() === '') {
        //                 logger.error('Ejercicio sin nombre');
        //                 return NextResponse.json({
        //                     error: "Todos los ejercicios deben tener nombre"
        //                 }, { status: 400 });
        //             }

        //             if (!exercise.reps || (typeof exercise.reps === 'string' && exercise.reps.trim() === '')) {
        //                 logger.error('Ejercicio sin repeticiones especificadas');
        //                 return NextResponse.json({
        //                     error: "Todos los ejercicios deben especificar las repeticiones"
        //                 }, { status: 400 });
        //             }

        //             if (!exercise.sets || exercise.sets < 1) {
        //                 logger.error('Ejercicio con número de series inválido');
        //                 return NextResponse.json({
        //                     error: "Todos los ejercicios deben tener al menos 1 serie"
        //                 }, { status: 400 });
        //             }
        //         }
        //     }
        // }

        logger.info(`Intentando crear nueva planilla para usuario: ${planilla.userId}`);
        await Plani.create(planilla);

        const ultima_planilla = await User.findByIdAndUpdate(
            { _id: new ObjectId(planilla.userId as string) },
            { ultima_plani: Date.now() },
            { new: true }
        );

        if (!ultima_planilla) {
            logger.error(`Error al actualizar última planilla para usuario: ${planilla.userId}`);
            return new NextResponse("No se pudo actualizar la fecha de la ultima planilla", { status: 400 });
        }

        logger.info(`Planilla creada exitosamente para usuario: ${planilla.userId}`);
        return new NextResponse("ejercicio agregado con exito", { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`Error en POST /api/planillas: ${error.message}`);
            return NextResponse.json({
                error: "Error al procesar la planilla: " + error.message
            }, { status: 500 });
        }
        logger.error('Error desconocido en POST /api/planillas');
        return NextResponse.json({ error: "Error desconocido" }, { status: 500 });
    }
}

export const DELETE = async (req: Request): Promise<NextResponse> => {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
        logger.warn('Intento de acceso no autorizado al endpoint DELETE /api/planillas');
        return new NextResponse("No autorizado", { status: 401 });
    }

    try {
        await connect();
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            logger.warn('Intento de eliminación sin ID');
            return NextResponse.json({ error: "El ID es obligatorio" }, { status: 400 });
        }

        if (!ObjectId.isValid(id)) {
            logger.warn(`ID inválido proporcionado para eliminación: ${id}`);
            return NextResponse.json({ error: "El ID proporcionado no es válido" }, { status: 400 });
        }

        const deletedRoutine = await Plani.findByIdAndDelete(new ObjectId(id));
        if (!deletedRoutine) {
            logger.warn(`Rutina no encontrada para eliminar con ID: ${id}`);
            return NextResponse.json({ error: "Rutina no encontrada" }, { status: 404 });
        }

        logger.info(`Rutina eliminada exitosamente: ${id}`);
        return NextResponse.json({ messaje: "Rutina eliminada" }, { status: 200 })
    }
    catch (error: unknown) {
        logger.error(`Error en DELETE /api/planillas: ${error}`);
        return NextResponse.json({ error: "Ejercicio no encontrado" + error }, { status: 404 });
    }
}

export const PUT = async (req: Request): Promise<NextResponse> => {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
        logger.warn('Intento de acceso no autorizado al endpoint PUT /api/planillas');
        return new NextResponse("No autorizado", { status: 401 });
    }

    try {
        const { id, plani } = await req.json();
        await connect();
        logger.debug("Datos recibidos para actualizar la planilla: ", { id, plani });
        console.log(id);
        if (!ObjectId.isValid(id)) {
            logger.warn(`ID inválido proporcionado para actualización: ${id}`);
            return NextResponse.json({ error: "El ID proporcionado no es válido" }, { status: 400 });
        }

        const editedPlani = await Plani.findByIdAndUpdate(new ObjectId(id as string), plani);
        if (!editedPlani) {
            logger.error(`No se pudo editar la planilla con ID: ${id}`);
            return NextResponse.json({ message: "No se pudo editar la planilla" }, { status: 501 });
        }

        logger.info(`Planilla actualizada exitosamente: ${id}`);
        return NextResponse.json({ message: "todo ok" }, { status: 200 });

    } catch (error: unknown) {
        logger.error(`Error en PUT /api/planillas: ${error}`);
        return NextResponse.json({ error: error }, { status: 501 });
    }
}