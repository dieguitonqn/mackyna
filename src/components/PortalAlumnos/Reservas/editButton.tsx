"use client";

import { Turnos } from "@/types/turnos";
import React, { useEffect } from "react";
import { useState } from "react";
import { FaEdit } from 'react-icons/fa';
import {fetchTurnos} from "@/lib/turnosUtils"

interface EditButtonProps {
  turnoId: string;
  userId: string;
}

export const EditButton = ({ turnoId, userId }: EditButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState("");
  const [turnos, setTurnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // try {
  //   const turnosDB: Turnos[] = (await fetchTurnos(selectedDia)) as Turnos[] || []; // Llamada asíncrona
  //   setTurnos(turnosDB); // Actualiza el estado con los turnos obtenidos
  //   // console.log(turnosDB)
  // } catch (error) {
  //   console.error('Error al obtener turnos:', error);
  //   setTurnos([]);
  // }

 
  // const fetchTurnos = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch('/api/reservas');
  //     const data = await response.json();
  //     setTurnos(data);
  //   } catch (error) {
  //     console.error('Error al cargar reservas:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleEditarReserva = async () => {
    if (!selectedTurno) {
      alert("Por favor selecciona un turno");
      return;
    }

    try {
      const response = await fetch(`/api/reservas`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          turnoID: selectedTurno, 
          userID: userId,
          oldTurnoID: turnoId 
        }),
      });

      if (response.ok) {
        alert("Reserva editada correctamente");
        setShowModal(false);
        window.location.reload(); // Recargar para ver los cambios
      } else {
        const errorData = await response.json();
        alert(errorData.mensaje || "Error al editar la reserva");
      }
    } catch (error) {
      console.error(error);
      alert("Error al editar la reserva");
    }
  };

  return (
    <>
      <button
        className="text-blue-500 hover:text-blue-700 transition-colors"
        onClick={() => {
          setShowModal(true);
          
        }}
      >
        <FaEdit className="h-5 w-5" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Editar Reserva</h2>
            
            {loading ? (
              <p>Cargando turnos...</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {turnos.map((turno) => (
                    <button
                      key={turno._id}
                      onClick={() => setSelectedTurno(turno._id)}
                      className={`p-3 rounded-lg border ${
                        selectedTurno === turno._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <p className="font-medium">{turno.dia_semana}</p>
                      <p className="text-sm text-gray-600">
                        {turno.hora_inicio} - {turno.hora_fin}
                      </p>
                      <p className="text-sm text-gray-500">
                        Cupos: {turno.cupos_disponibles}/12
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={handleEditarReserva}
                  >
                    Confirmar Cambio
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
