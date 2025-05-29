'use client'
import { fetchTurnos } from '@/lib/turnosUtils';
import React, { useState, useEffect } from 'react'
import { Turnos } from '@/types/turnos';

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';



function Page() {
  const { data: session } = useSession();
  const [turnos, setTurnos] = useState<Turnos[]>([]);
  const [selectedTurnos, setSelectedTurnos] = useState<{ [dia: string]: string }>({});
  const router = useRouter();

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  // Obtener todos los turnos al cargar la página
  useEffect(() => {
    const fetchAllTurnos = async () => {
      try {
        let turnosDB: Turnos[] = [];
        for (const dia of diasSemana) {
          const turnosDia = await fetchTurnos(dia);
          if (Array.isArray(turnosDia)) {
            turnosDB = turnosDB.concat(turnosDia);
          }
        }
        setTurnos(turnosDB);
      } catch (error) {
        console.error('Error al obtener turnos:', error);
        setTurnos([]);
      }
    };
    fetchAllTurnos();
  }, []);

  // Agrupar turnos por día
  const turnosPorDia: { [dia: string]: Turnos[] } = turnos.reduce((acc, turno) => {
    if (!acc[turno.dia_semana]) acc[turno.dia_semana] = [];
    acc[turno.dia_semana].push(turno);
    return acc;
  }, {} as { [dia: string]: Turnos[] });

  // Manejar selección de turnos (uno por día)
  const handleCheckboxChange = (dia: string, turnoId: string) => {
    setSelectedTurnos((prev) => ({ ...prev, [dia]: prev[dia] === turnoId ? '' : turnoId }));
  };

  // Reservar todos los turnos seleccionados
  const handleReservaMultiple = async () => {
    const turnosAReservar = Object.values(selectedTurnos).filter(Boolean);
    if (turnosAReservar.length === 0) {
      alert('Selecciona al menos un turno para reservar.');
      return;
    }
    try {
      const reserva = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({ userID: session?.user.id, turnoIDs: turnosAReservar })
      });

      if (reserva.ok) {
        const data = await reserva.json();
        const dias_disp = data.dias_disp;
        alert(`Reservas creadas exitosamente. Te quedan ${dias_disp} días disponibles.`);
        setSelectedTurnos({});
      } else if (reserva.status === 401) {
        alert('Ocurrió un error al crear la reserva. Usted no tiene más cupo disponible.');
      } else if (reserva.status === 400) {
        alert("No tiene configurado el cupo disponible. Por favor, contactese con su profesor para solucionar este inconveniente.");
      } else if (reserva.status === 402) {
        alert("No hay cupos disponibles. Por favor, seleccione otro turno.");
      } else if (reserva.status === 403) {
        alert("Ya tienes una reserva en uno de estos turnos. Por favor, selecciona otros turnos.");
      }
      router.refresh();
    } catch (error: unknown) {
      console.error('Error:', error);
      alert('Ocurrió un error inesperado. Por favor, contacta con el administrador.');
    }
  };

  return (
    <div className='h-full md:h-screen'>
      <h2 className="text-2xl font-bold mb-4">Turnos</h2>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {diasSemana.map((dia) => (
              <div key={dia} className="bg-slate-100 rounded-md p-4 shadow-md min-h-[200px] flex flex-col">
                <div className="font-semibold text-center mb-2">{dia}</div>
                {turnosPorDia[dia] && turnosPorDia[dia].length > 0 ? (
                  turnosPorDia[dia].map((turno) => (
                    <label key={turno._id} className="flex items-center mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTurnos[dia] === turno._id}
                        onChange={() => handleCheckboxChange(dia, turno._id)}
                        className="mr-2 accent-green-700"
                        disabled={turno.cupos_disponibles <= 0}
                      />
                      <span className="flex-1">
                        {turno.hora_inicio} - {turno.hora_fin} <span className="text-xs text-gray-500">({turno.cupos_disponibles} cupos)</span>
                      </span>
                    </label>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm text-center">Sin turnos</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-700/80 text-white px-6 py-2 rounded-md text-lg shadow-md hover:bg-green-800 disabled:bg-gray-400"
              onClick={handleReservaMultiple}
              disabled={Object.values(selectedTurnos).filter(Boolean).length === 0}
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page
