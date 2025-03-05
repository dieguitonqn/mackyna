'use client';
import { CardPagos } from '@/components/PortalAlumnos/Pagos/cardPagos'
import React from 'react'


function page() {
  async function handlePago(texto: string, precio: number) {
    console.log(`Pago realizado por ${texto} por un monto de ${precio}`)
    
    try {
      const response = await fetch('/api/mp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clase: texto, precio }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.link);
        window.location.href = data.link;
      } else {
        console.error('Error al realizar el pago');
      }
      
    } catch (error:unknown) {
      if (error instanceof Error) {
        console.error(error.message)
      }
      console.error(error)
    }
 

  }
  return (
    <div className="flex flex-wrap items-center justify-center h-full md:h-screen gap-5 my-2">
      <CardPagos texto='Clase Individual' precio={6500} onclick={handlePago} />
      <CardPagos texto='Semana' precio={25000} onclick={handlePago}/>
      <CardPagos texto="Quincena" precio={35000} onclick={handlePago} />
      <CardPagos texto="3 Días" precio={45000} onclick={handlePago}/>
      <CardPagos texto="4 ó 5 Días" precio={50000} onclick={handlePago}/>
      <CardPagos texto="Libre" precio={60000} onclick={handlePago}/>
    </div>
  )
}

export default page
