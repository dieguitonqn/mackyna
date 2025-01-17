import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import Reserva from "@/lib/models/reservas";
import { ObjectId } from "mongodb";
import { IUser } from "@/types/user"
import Turno from "@/lib/models/turnos";
import { Turnos } from "@/types/turnos";


export const POST = async (req: Request) => {
    const body = await req.json();
    // console.log(body);
    try {
        await connect()
        const user: IUser | null = await User.findOne({ _id: new ObjectId(body.userID as string) });
        if (!user) {
            throw new Error("User not found");
        }
        // console.log(user.dias_permitidos);
        let dias_disp: number | undefined;
        try {
            const userReservas: number = await Reserva.countDocuments({ "userInfo.userId": body.userID });
            const userPrevReservas: number = await Reserva.countDocuments({ "userInfo.userId": body.userID, "turnoInfo.turnoId": body.turnoID });
            const turno: Turnos | null = await Turno.findById(body.turnoID);
            // console.log("Cantidad de reservas del usuario: " + userPrevReservas);
            // const user:IUser | null = await User.findById(body.userID);
            if(userPrevReservas > 0){
                return new NextResponse("Ya tienes una reserva en este turno", { status: 403 })
            }
            if (user.dias_permitidos !== undefined && userReservas >= user.dias_permitidos) {
                return new NextResponse("Exeso de reservas", { status: 401 })
            }
            if (user.dias_permitidos !== undefined) {
                dias_disp = user.dias_permitidos as number - userReservas;
                // console.log("Cantidad de días disponible del usuario: " + dias_disp);
            } else if (turno?.cupos_disponibles === 0) {
                return new NextResponse("No hay cupos disponibles", { status: 402 });
            } else {
                return new NextResponse("Dias permitidos is undefined", { status: 400 });
            }
            const newReserva = new Reserva({
                userInfo:{
                    userId:user?._id.toString(),
                    nombre:user?.nombre,
                    apellido:user?.apellido
                }, 
                turnoInfo:{
                    turnoId:turno?._id.toString(),
                    dia_semana:turno?.dia_semana,
                    hora_inicio:turno?.hora_inicio,
                    hora_fin:turno?.hora_fin,
                },
                fecha: new Date(),
                estado: "activa",
                observaciones: " "

            })
            // console.log(newReserva);
            await newReserva.save();
            await Turno.findByIdAndUpdate(body.turnoID, { $inc: { cupos_disponibles: -1 } });
            return new NextResponse(JSON.stringify({ message: "todo ok", dias_disp: dias_disp - 1 }), { status: 200 });
        } catch (error: unknown) {
            console.log(error)
        }
    } catch (error: unknown) {
        console.log(error)
    }


}

export const DELETE = async (req: Request) => {
    const body = await req.json();
    // console.log(body);
    await connect();
    try {
        const reservaC = await Reserva.deleteOne({"turnoInfo.turnoId":body.turnoID,"userInfo.userId":body.userID});
        if(reservaC.deletedCount === 0){
            return new NextResponse("Reserva no encontrada", { status: 404 });
        }
        await Turno.findByIdAndUpdate(body.turnoID, { $inc: { cupos_disponibles: 1 } });
        return new NextResponse("Reserva cancelada correctamente", { status: 200 });
    } catch (error:unknown) {
        return new NextResponse("Error al cancelar la reserva"+error, {status:500})
    }
    
}


export async function GET() {
    try {
        await connect();
        const reservasData = await Reserva.find().lean();

        const reservas = reservasData.map(doc => ({
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
        }));

        return NextResponse.json(reservas);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener las reservas' +error},
            { status: 500 }
        );
    }
}