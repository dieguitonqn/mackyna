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
        await connect()
        const user: IUser | null = await User.findOne({ _id: new ObjectId(body.userID as string) });
        if (!user) {
            logger.error(`Usuario no encontrado: ${body.userID}`);
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }

        try {
            const userReservas: number = await Reserva.countDocuments({ "userInfo.userId": body.userID });
            const turno: Turnos | null = await Turno.findById(body.turnoID);

            if (!turno) {
                logger.error(`Turno no encontrado: ${body.turnoID}`);
                return new NextResponse("Turno no encontrado", { status: 404 });
            }

            // Verificar si el usuario ya tiene una reserva en el mismo día
            const reservasMismoDia = await Reserva.findOne({
                "userInfo.userId": body.userID,
                "turnoInfo.dia_semana": turno.dia_semana
            });

            if (reservasMismoDia) {
                logger.warn(`Usuario ${body.userID} intentó reservar más de un turno en el día ${turno.dia_semana}`);
                return new NextResponse("Ya tienes una reserva para este día", { status: 403 });
            }

            // Verificar si el usuario ya tiene una reserva en este turno específico
            const userPrevReservas: number = await Reserva.countDocuments({
                "userInfo.userId": body.userID,
                "turnoInfo.turnoId": body.turnoID
            });

            if (userPrevReservas > 0) {
                logger.warn(`Usuario ${body.userID} intentó reservar el mismo turno dos veces`);
                return new NextResponse("Ya tienes una reserva en este turno", { status: 403 });
            }

            // Verificar límite de reservas del usuario
            if (user.dias_permitidos !== undefined && userReservas >= user.dias_permitidos) {
                logger.warn(`Usuario ${body.userID} excedió su límite de reservas`);
                return new NextResponse("Exceso de reservas", { status: 401 });
            }

            // Verificar cupos disponibles
            if (turno.cupos_disponibles === 0) {
                logger.warn(`Intento de reserva en turno sin cupos: ${body.turnoID}`);
                return new NextResponse("No hay cupos disponibles", { status: 402 });
            }

            const dias_disp = user.dias_permitidos ? user.dias_permitidos - userReservas : undefined;

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
            await Turno.findByIdAndUpdate(body.turnoID, { $inc: { cupos_disponibles: -1 } });

            logger.info(`Reserva creada exitosamente para usuario ${body.userID} en turno ${body.turnoID}`);
            return new NextResponse(JSON.stringify({
                message: "Reserva confirmada",
                dias_disp: dias_disp ? dias_disp - 1 : undefined
            }), { status: 200 });

        } catch (error: unknown) {
            logger.error(`Error al procesar la reserva: ${error}`);
            return new NextResponse("Error al procesar la reserva", { status: 500 });
        }
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

        if (diaActual === turno.dia_semana.toLocaleLowerCase() && (horaActual > parseInt(turno.hora_inicio.split(":")[0]) || (horaActual === parseInt(turno.hora_inicio.split(":")[0]) && minutoActual > 50))) {
            return new NextResponse(JSON.stringify({ mensaje: "No se puede cancelar menos de 10 min antes del turno" }), { status: 403 });
        }

        if (diaActual === turno.dia_semana.toLocaleLowerCase() && horaActual > parseInt(turno.hora_inicio.split(":")[0])) {
            return new NextResponse(JSON.stringify({ mensaje: "No se puede cancelar un turno que ya comenzó" }), { status: 403 });
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
        
        if (diasSemana.indexOf(turno.dia_semana.toLocaleLowerCase()) > diasSemana.indexOf(diaActual)) {
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