import { authOptions } from '@/lib/auth0';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'
import Reserva from '@/lib/models/reservas';
import { IReserva } from "@/types/reserva"
import Turno from '@/lib/models/turnos';
import { Turnos } from "@/types/turnos";
import { ObjectId } from 'mongodb';
import CancelButton from '@/components/PortalAlumnos/Reservas/cancelButton';
import Link from 'next/link';
import { FaRegCalendarPlus } from "react-icons/fa";
// import { Condiciones } from '@/components/PortalAlumnos/Reservas/Condiciones';




async function Reservas() {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login');
    }



    try {
        const reservas: IReserva[] = (await Reserva.find({ "userInfo.userId": session.user.id }).sort({ "turnoInfo.dia_semana": 1, "turnoInfo.hora_inicio": 1 }).lean()).map(reserva => ({
            userInfo: {
                userId: reserva.userInfo.userId,
                nombre: reserva.userInfo.nombre,
                apellido: reserva.userInfo.apellido

            },
            turnoInfo: {
                turnoId: reserva.turnoInfo.turnoId,
                dia_semana: reserva.turnoInfo.dia_semana,
                hora_inicio: reserva.turnoInfo.hora_inicio,
                hora_fin: reserva.turnoInfo.hora_fin,

            },
            fecha: reserva.fecha,
            estado: reserva.estado,
            observaciones: reserva.observaciones
        }));
        if (reservas.length === 0) {
            return (
                <div className='h-screen flex flex-col justify-center items-center'>
                    {/* <Condiciones /> */}
                    <div className='text-2xl font-bold text-slate-300'>No existen reservas para este usuario</div>
                    <div className='flex justify-end m-5 md:m-10'>
                        <Link
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 hover:font-bold flex flex-row items-center gap-2 '
                            href='/portalAlumnos/Turnos'><FaRegCalendarPlus className='flex' />Nueva Reserva</Link>
                    </div>

                </div>
            )

        }

        const reservasConTurnos = await Promise.all(
            reservas.map(async (reserva) => {
                const turnoDoc = await Turno.findById(new ObjectId(reserva.turnoInfo.turnoId)).lean() as unknown as Turnos;
                return {
                    ...reserva,
                    turnoInfo: {
                        ...reserva.turnoInfo,
                        cupos_disponibles: turnoDoc?.cupos_disponibles ?? 0
                    }
                };
            })
        );

        return (
            <div className='h-full md:h-screen'>
                <div className='flex justify-center items-center text-slate-300 text-5xl font-bold'>
                    Mis reservas
                </div>
                {/* <Condiciones />  */}
                <div className='flex justify-end m-5 md:m-10'>
                    <Link
                        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 hover:font-bold flex flex-row items-center gap-2 '
                        href='/portalAlumnos/Turnos'><FaRegCalendarPlus className='flex' />Nueva Reserva</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {
                        reservasConTurnos.map((reserva) => (
                            <div key={reserva.turnoInfo.turnoId}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                                <div className="flex flex-col space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Día de la semana</span>
                                        <span className="font-semibold">{reserva.turnoInfo.dia_semana}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Hora de inicio</span>
                                        <span className="font-semibold">{reserva.turnoInfo.hora_inicio}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Hora de finalización</span>
                                        <span className="font-semibold">{reserva.turnoInfo.hora_fin}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Personas en el turno</span>
                                        <span className="font-semibold">{12 - reserva.turnoInfo.cupos_disponibles}/12</span>
                                    </div>
                                    <div>
                                        <CancelButton turnoId={reserva.turnoInfo.turnoId} userId={reserva.userInfo.userId} />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    } catch (error: unknown) {
        console.log(error);
        return <div>No existen reservas para este usuario</div>
    }

}

export default Reservas
