"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function CancelButton({
  turnoId,
  userId,
}: {
  turnoId: string;
  userId: string;
}) {
  const router = useRouter();


  const handleCancelarReserva = async (turnoId: string, userId: string) => {
    if (!confirm("Para CAMBIAR tu reserva, primero hay que cancelar la actual. \nPara CANCELAR la reserva seleccionada, presione aceptar.")) {
      return;
    }
    const response = await fetch(`/api/reservas`, {
      method: "DELETE",
      body: JSON.stringify({ turnoID: turnoId, userID: userId }),
    });
    if (response.ok) {
      if(!confirm("Reserva cancelada correctamente, ¿Desea reservar otro turno?")){
        return;
      }
      router.push("/portalAlumnos/Turnos");
    } else {
      const errorMessage = await response.json();
      alert(
        "Error al cancelar la reserva: " + errorMessage.mensaje ||
          "Error desconocido"
      );
    }
  };

  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:shadow-lg hover:scale-105 transition-transform duration-200"
      onClick={() => handleCancelarReserva(turnoId, userId)}
    >
      <span className="text-white font-semibold">Cancelar</span> | Cambiar 
    </button>
  );
}
