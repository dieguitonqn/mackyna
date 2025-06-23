'use client'

import useSWR from 'swr';
import { TableCell } from '@/components/PortalProfes/Reservas/TableCell';
import { IReserva } from "@/types/reserva";

// Primero creamos un fetcher genérico
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Reservas() {
    const HORAS = [
        "07:00", "08:00", "09:00", "10:00", "11:00", "13:00",
        "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
        "20:00", "21:00",
    ];
    
    const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    // Usar SWR para obtener las reservas
    const { data: reservas, error, isLoading } = useSWR<IReserva[]>(
        '/api/reservas', 
        fetcher,
        {
            refreshInterval: 5000, // Actualizar cada 5 segundos
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        }
    );

    const getColorByReservas = (cantidad: number): string => {
        switch (cantidad) {
            case 12: return 'bg-red-600';
            case 11: return 'bg-red-500';
            case 10: return 'bg-red-400';
            case 9: return 'bg-orange-600';
            case 8: return 'bg-orange-500';
            case 7: return 'bg-orange-400';
            case 6: return 'bg-yellow-500';
            case 5: return 'bg-yellow-400';
            case 4: return 'bg-yellow-300';
            case 3: return 'bg-green-300';
            case 2: return 'bg-green-400';
            case 1: return 'bg-green-500';
            default: return 'bg-green-600';
        }
    };
    
    const filtrarReservas = (reservas: IReserva[], dia: string, hora: string) => {
        return reservas.filter(reserva =>
            reserva.turnoInfo.dia_semana === dia &&
            reserva.turnoInfo.hora_inicio === hora
        );
    };

    if (error) return <div className="text-center p-4">Error al cargar las reservas</div>;
    if (isLoading) return <div className="text-center p-4">Cargando...</div>;
    if (!reservas) return <div className="text-center p-4">No hay reservas disponibles</div>;
  
    return (
        <div>
            <h1 className="flex justify-center items-center text-4xl font-semibold my-5">Reservas</h1>
            <div className="flex justify-center items-center overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-200">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 py-2 border border-gray-300 text-left">Hora</th>
                            {DIAS.map(dia => (
                                <th
                                    className="px-4 py-2 border border-gray-300 text-left"
                                    key={dia}>
                                    {dia}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {HORAS.map(hora => (
                            <tr className="odd:bg-gray-50 even:bg-gray-100" key={hora}>
                                <th className="px-4 py-2 border border-gray-300 font-medium text-gray-700">{hora}</th>
                                {DIAS.map(dia => {
                                    const reservasFiltradas = filtrarReservas(reservas, dia, hora);
                                    return (
                                        <TableCell
                                            key={`${dia}-${hora}`}
                                            reservas={reservasFiltradas}
                                            getColorClass={getColorByReservas}
                                            dia={dia}
                                            hora={hora}
                                        />
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}