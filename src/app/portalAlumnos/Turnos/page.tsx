'use client'
import { fetchTurnos } from '@/lib/turnosUtils';
import React, { useState } from 'react'
import { Turnos } from '@/types/turnos';

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';



function Page() {
  const { data: session } = useSession();
  const [turnos, setTurnos] = useState<Turnos[]>([]);
  const router = useRouter()


  const handleSelect: React.ChangeEventHandler<HTMLSelectElement> = async (e) => {
    // console.log((e.target as HTMLSelectElement).value);
    const selectedDia = (e.target as HTMLSelectElement).value
    


    try {
      const turnosDB: Turnos[] = (await fetchTurnos(selectedDia)) as Turnos[] || []; // Llamada asíncrona
      setTurnos(turnosDB); // Actualiza el estado con los turnos obtenidos
      // console.log(turnosDB)
    } catch (error) {
      console.error('Error al obtener turnos:', error);
      setTurnos([]);
    }

  }

  const handleReserva = async (_id: string) => {
    console.log(session?.user.id);
    console.log(_id);
    try {
      const reserva = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({ userID: session?.user.id, turnoID: _id })
      })

      if (reserva.ok) {
        const data = await reserva.json();
        const dias_disp = data.dias_disp;
        console.log(dias_disp)
        alert(`Reserva creada exitosamente. Te quedan ${dias_disp} días disponibles.`);

      } else if (reserva.status === 401) {
        // Manejar el caso en que la reserva no se creó correctamente
        // console.error('Error al crear la reserva:');
        alert('Ocurrió un error al crear la reserva. Usted no tiene más cupo disponible.');
      }
      else if (reserva.status === 400) {
        alert("No tiene configurado el cupo disponible. Por favor, contactese con su profesor para solucionar este inconveniente.");

      }
      else if (reserva.status === 402) {
        alert("No hay cupos disponibles. Por favor, seleccione otro turno.");
      }
      else if (reserva.status === 403) {
        alert("Ya tienes una reserva en este turno. Por favor, seleccione otro turno.");
      }
      router.refresh();
    } catch (error: unknown) {
      console.error('Error:', error);
      alert('Ocurrió un error inesperado. Por favor, contacta con el administrador.');
    }
  }


  return (
    <div className='h-full md:h-screen'>
      Turnos
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center bg-slate-100 rounded-md p-6 my-5 shadow-md">
          <label htmlFor="dia">Seleccione un día:</label>
          <select
            name="dia"
            id="dia"
            onChange={(e) => handleSelect(e)}
            className="w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
          >
            <option value="" >
              
            </option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
          </select>
        </div>

        <div>
          {turnos && turnos.length > 0 && (
            <div className="md:grid md:grid-cols-4 gap-6 flex flex-wrap justify-center">
              {turnos.map((turno, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 transition-transform hover:scale-105"
                >
                  <div className="text-lg font-semibold text-gray-700">
                    {turno.hora_inicio} - {turno.hora_fin}
                  </div>
                  <div className="text-sm text-gray-500">
                    Cupos disponibles:{" "}
                    <span className="font-medium text-green-600">
                      {turno.cupos_disponibles.toString()}
                    </span>
                  </div>
                  <div className="mt-4">
                    <button
                      className='bg-green-700/80 text-white px-2 py-1 rounded-md'
                      onClick={() => handleReserva(turno._id)}
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>




      </div>
    </div>
  )
}

export default Page
