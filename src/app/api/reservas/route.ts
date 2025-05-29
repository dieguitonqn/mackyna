import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import Reserva from "@/lib/models/reservas";
import { ObjectId } from "mongodb";
import { IUser } from "@/types/user"
import Turno from "@/lib/models/turnos";
import { Turnos } from "@/types/turnos";
import logger from "@/lib/logger";


export const POST = async (req: Request) => {
    const body = await req.json();
    try {
        await connect();
        const user: IUser | null = await User.findOne({ _id: new ObjectId(body.userID as string) });
        if (!user) {
            logger.error(`Usuario no encontrado: ${body.userID}`);
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }

        // Soporte para reservas múltiples
        const turnoIDs: string[] = Array.isArray(body.turnoIDs) ? body.turnoIDs : (body.turnoID ? [body.turnoID] : []);
        if (turnoIDs.length === 0) {
            return new NextResponse("No se especificaron turnos para reservar", { status: 400 });
        }

        let userReservas: number = await Reserva.countDocuments({ "userInfo.userId": body.userID });
        const resultados: any[] = [];
        let dias_disp = user.dias_permitidos ? user.dias_permitidos - userReservas : undefined;

        for (const turnoID of turnoIDs) {
            try {
                const turno: Turnos | null = await Turno.findById(turnoID);
                if (!turno) {
                    resultados.push({ turnoID, status: 404, message: "Turno no encontrado" });
                    continue;
                }
                // Verificar si el usuario ya tiene una reserva en el mismo día
                const reservasMismoDia = await Reserva.findOne({
                    "userInfo.userId": body.userID,
                    "turnoInfo.dia_semana": turno.dia_semana
                });
                if (reservasMismoDia) {
                    resultados.push({ turnoID, status: 403, message: `Ya tienes una reserva para el día ${turno.dia_semana}` });
                    continue;
                }
                // Verificar si el usuario ya tiene una reserva en este turno específico
                const userPrevReservas: number = await Reserva.countDocuments({
                    "userInfo.userId": body.userID,
                    "turnoInfo.turnoId": turnoID
                });
                if (userPrevReservas > 0) {
                    resultados.push({ turnoID, status: 403, message: "Ya tienes una reserva en este turno" });
                    continue;
                }
                // Verificar límite de reservas del usuario
                if (user.dias_permitidos !== undefined && userReservas >= user.dias_permitidos) {
                    resultados.push({ turnoID, status: 401, message: "Exceso de reservas" });
                    continue;
                }
                // Verificar cupos disponibles
                if (turno.cupos_disponibles === 0) {
                    resultados.push({ turnoID, status: 402, message: "No hay cupos disponibles" });
                    continue;
                }
                // Crear reserva
                const newReserva = new Reserva({
                    userInfo: {
                        userId: user._id.toString(),
                        nombre: user.nombre,
                        apellido: user.apellido
                    },
                    turnoInfo: {
                        turnoId: turno._id.toString(),
                        dia_semana: turno.dia_semana,
                        hora_inicio: turno.hora_inicio,
                        hora_fin: turno.hora_fin,
                    },
                    fecha: new Date(),
                    estado: "activa",
                    observaciones: " "
                });
                await newReserva.save();
                await Turno.findByIdAndUpdate(turnoID, { $inc: { cupos_disponibles: -1 } });
                userReservas++;
                dias_disp = user.dias_permitidos ? user.dias_permitidos - userReservas : undefined;
                resultados.push({ turnoID, status: 200, message: "Reserva confirmada" });
            } catch (error: unknown) {
                logger.error(`Error al procesar la reserva para turno ${turnoID}: ${error}`);
                resultados.push({ turnoID, status: 500, message: "Error al procesar la reserva" });
            }
        }
        logger.info(`Reservas procesadas para usuario ${body.userID}: ${JSON.stringify(resultados)}`);
        return new NextResponse(JSON.stringify({ resultados, dias_disp }), { status: 200 });
    } catch (error: unknown) {
        logger.error(`Error en la conexión: ${error}`);
        return new NextResponse("Error de conexión", { status: 500 });
    }
}

export const DELETE = async (req: Request) => {
    const body = await req.json();
    await connect();
    try {
        const turno: Turnos | null = await Turno.findById(body.turnoID);
        if (!turno) {
            return new NextResponse("Turno no encontrado", { status: 404 });
        }

        const fecha = new Date(Date.now());
        const horaActual = fecha.getHours();
        const minutoActual = fecha.getMinutes();
        const diaActual = fecha.toLocaleDateString('es-AR', { weekday: 'long' }).toLocaleLowerCase();

        const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

        // Verificar si el turno es de un día anterior
        if (diasSemana.indexOf(turno.dia_semana.toLocaleLowerCase()) < diasSemana.indexOf(diaActual)) {
            return new NextResponse(JSON.stringify({ mensaje: "No se puede cancelar un turno de un día anterior" }), { status: 403 });
        }

        if (diaActual === turno.dia_semana.toLocaleLowerCase() && ((horaActual === parseInt(turno.hora_inicio.split(":")[0]) && minutoActual > 0))) {
            return new NextResponse(JSON.stringify({ mensaje: "No se puede cancelar menos de 30 min antes del turno" }), { status: 403 });
        }

        if (diaActual === turno.dia_semana.toLocaleLowerCase() && horaActual > parseInt(turno.hora_inicio.split(":")[0])) {
            return new NextResponse(JSON.stringify({ mensaje: "No se puede cancelar un turno que ya comenzó o que pasó el mismo día" }), { status: 403 });
        }

        // Verificar si es viernes después de las 20hs
        if (diaActual === "viernes" && (horaActual > 20 || (horaActual === 20 && minutoActual > 0))) {
            // Permitir cancelación
            const reservaC = await Reserva.deleteOne({ "turnoInfo.turnoId": body.turnoID, "userInfo.userId": body.userID });
            if (reservaC.deletedCount === 0) {
                return new NextResponse(JSON.stringify({mensaje:"Reserva no encontrada"}), { status: 404 });
            }

            // Incrementar cupos disponibles
            await Turno.findByIdAndUpdate(body.turnoID, { $inc: { cupos_disponibles: 1 } });
            return new NextResponse("Reserva cancelada correctamente", { status: 200 });
        }
        
        if (diasSemana.indexOf(turno.dia_semana.toLocaleLowerCase()) >= diasSemana.indexOf(diaActual)) {
            // Permitir cancelación
            const reservaC = await Reserva.deleteOne({ "turnoInfo.turnoId": body.turnoID, "userInfo.userId": body.userID });
            if (reservaC.deletedCount === 0) {
                return new NextResponse(JSON.stringify({mensaje:"Reserva no encontrada"}), { status: 404 });
            }

            // Incrementar cupos disponibles
            await Turno.findByIdAndUpdate(body.turnoID, { $inc: { cupos_disponibles: 1 } });
            return new NextResponse("Reserva cancelada correctamente", { status: 200 });
        }
        
        else {
            return new NextResponse("No se puede cancelar el turno en este horario", { status: 403 });
        }
    } catch (error: unknown) {
        return new NextResponse("Error al cancelar la reserva: " + error, { status: 500 });
    }
}


export async function GET() {
    try {
        await connect();
        const reservasData = await Reserva.find().lean();

        const reservas = await Promise.all(reservasData.map(async doc => {
            const userHab = await User.findOne({ _id: new ObjectId(doc.userInfo.userId.toString() as string), habilitado: true });
            if (userHab) {
                return {
                    userInfo: {
                        userId: doc.userInfo.userId.toString(),
                        nombre: doc.userInfo.nombre,
                        apellido: doc.userInfo.apellido
                    },
                    turnoInfo: {
                        turnoId: doc.turnoInfo.turnoId.toString(),
                        dia_semana: doc.turnoInfo.dia_semana,
                        hora_inicio: doc.turnoInfo.hora_inicio,
                        hora_fin: doc.turnoInfo.hora_fin,
                    },
                    fecha: doc.fecha,
                    estado: doc.estado,
                    observaciones: doc.observaciones
                };
            }
            return null;
        }));

        const reservasFiltradas = reservas.filter(reserva => reserva !== null);

        return NextResponse.json(reservasFiltradas);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener las reservas: ' + error },
            { status: 500 }
        );
    }
}