'use client'
import { useRouter } from "next/navigation";
import React from "react";

export default function CancelButton({turnoId, userId}:{turnoId:string, userId:string}){
    const router=useRouter();
    const handleCancelarReserva = async (turnoId: string, userId: string) => {
        const response = await fetch(`/api/reservas`, {
            method: 'DELETE',
            body: JSON.stringify({ turnoID: turnoId, userID: userId })
        });
        if (response.ok) {
            alert('Reserva cancelada correctamente');
            router.refresh();
        }
        // alert('Reserva cancelada correctamente');
    };
    
    return (
        <button className='bg-red-500 text-white px-4 py-2 rounded-md'
        onClick={() => handleCancelarReserva(turnoId, userId)}>
            Cancelar reserva
        </button>
    )
}