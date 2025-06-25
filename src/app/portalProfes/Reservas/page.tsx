'use client'

import useSWR from 'swr';
import { TableCell } from '@/components/PortalProfes/Reservas/TableCell';
import { IReserva } from "@/types/reserva";
import { useState, useMemo } from 'react';

// Primero creamos un fetcher genérico
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Reservas() {
    const HORAS = [
        "07:00", "08:00", "09:00", "10:00", "11:00", "12:00","13:00",
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

    const [search, setSearch] = useState("");

    // Agrupar reservas por alumno
    const reservasPorAlumno = useMemo(() => {
        if (!reservas) return [];
        const map = new Map<string, { nombre: string; apellido: string; reservas: { dia: string; hora: string }[] }>();
        reservas.forEach(reserva => {
            const alumno = reserva.userInfo;
            if (!alumno) return;
            const key = alumno.userId  || (alumno.nombre + alumno.apellido);
            if (!map.has(key)) {
                map.set(key, {
                    nombre: alumno.nombre,
                    apellido: alumno.apellido,
                    reservas: []
                });
            }
            map.get(key)!.reservas.push({
                dia: reserva.turnoInfo.dia_semana,
                hora: reserva.turnoInfo.hora_inicio
            });
        });
        return Array.from(map.values());
    }, [reservas]);

    // Filtrar por nombre y apellido
    const alumnosFiltrados = useMemo(() => {
        if (!search) return reservasPorAlumno;
        return reservasPorAlumno.filter((alumno: { nombre: string; apellido: string }) =>
            (alumno.nombre + " " + alumno.apellido).toLowerCase().includes(search.toLowerCase())
        );
    }, [search, reservasPorAlumno]);

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

            {/* Tabla de reservas por alumno */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-200">Reservas por Alumno</h2>
                <div className="flex justify-center mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o apellido..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="px-4 py-2 border border-gray-600 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 w-80 bg-gray-800 text-gray-100 placeholder-gray-400"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 rounded-md shadow-lg border border-gray-600 text-sm">
                        <thead>
                            <tr className="text-gray-200">
                                <th className="px-4 py-2 text-left border-b border-gray-600">Nombre</th>
                                <th className="px-4 py-2 text-left border-b border-gray-600">Apellido</th>
                                <th className="px-4 py-2 text-left border-b border-gray-600">Reservas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-4 text-gray-400">No se encontraron alumnos.</td>
                                </tr>
                            ) : (
                                alumnosFiltrados.map((alumno: { nombre: string; apellido: string; reservas: { dia: string; hora: string }[] }, idx: number) => (
                                    <tr key={alumno.nombre + alumno.apellido + idx} className="hover:bg-gray-700 text-gray-200 border-b border-gray-700 last:border-b-0">
                                        <td className="px-4 py-2 font-medium">{alumno.nombre}</td>
                                        <td className="px-4 py-2">{alumno.apellido}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex flex-wrap gap-2">
                                                {alumno.reservas.map((res: { dia: string; hora: string }, i: number) => (
                                                    <span
                                                        key={res.dia + res.hora + i}
                                                        className="inline-block bg-blue-900/60 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold shadow border border-blue-700"
                                                    >
                                                        {res.dia} - {res.hora}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}