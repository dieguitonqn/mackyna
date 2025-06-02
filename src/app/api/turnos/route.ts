import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/db';
import Turno from '@/lib/models/turnos';
import { Turnos } from '@/types/turnos';    
import { ObjectId } from 'mongoose';



export const GET = async (req:NextRequest) => {
    const { searchParams } = new URL(req.url);
    const dia = searchParams.get('dia');
    const hora = searchParams.get('hora');
    if (!dia || !hora) {
        return new NextResponse("Faltan parámetros: 'dia' y/o 'hora'", { status: 400 });
    }
    ;
    try {
        await connect();
        const turnosData = await Turno.findOne({"dia_semana": dia, "hora_inicio": hora});

        if (!turnosData) {
            return new NextResponse("No se encontraron turnos para el día y hora especificados", { status: 404 });
        }
        const turnos: Turnos = {
            _id: (turnosData._id).toString(),
            dia_semana: turnosData.dia_semana,
            hora_inicio: turnosData.hora_inicio,
            hora_fin: turnosData.hora_fin,
            cupos_disponibles: turnosData.cupos_disponibles,
        };
        return new NextResponse(JSON.stringify(turnos), { status: 200 });
    } catch (error) {
        return new NextResponse("Error al obtener turnos: " + error, { status: 500 });
    }
}