"use client";
import { CardPagos } from "@/components/PortalAlumnos/Pagos/cardPagos";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React, { use, useEffect, useState } from "react";
import { IPago } from "@/types/pago";



function page() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [nuevoPago, setNuevoPago] = useState(false);
  const [pagos, setPagos] = useState<IPago[]>([]);

useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/pagos/?id=${session?.user.id}`);
        if (response.ok) {
          const data = await response.json();
          // console.log(data);
          setPagos(data);
        } else {
          console.error("Error al cargar los pagos");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session?.user.id]);


  async function handlePago(texto: string, precio: number) {
    
    try {
      const response = await fetch("/api/mp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clase: texto, precio, id: session?.user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.link);
        window.location.href = data.link;
      } else {
        console.error("Error al realizar el pago");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      console.error(error);
    }
  }
  return (
    <div>
      <div className="mb-6 h-screen">
        <h1 className="text-4xl text-center font-bold text-slate-200 mt-5">
          Mis Pagos
        </h1>
        <div className="max-w-4xl mx-auto p-4 bg-slate-800 rounded-lg shadow-md mt-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setNuevoPago(!nuevoPago)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {nuevoPago ? "Ocultar opciones" : "Nuevo Pago"}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-slate-700 text-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-600">
                <tr>
                  <th className="py-3 px-4 text-left">Fecha</th>
                  <th className="py-3 px-4 text-left">Concepto</th>
                  <th className="py-3 px-4 text-left">Monto</th>
                  <th className="py-3 px-4 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-center">
                      Cargando pagos...
                    </td>
                  </tr>
                ) : (
                  /* Aquí deberías mapear los pagos desde una API */
                  // [
                  //   { id: 1, fecha: '2023-06-01', concepto: 'Clase Individual', monto: '$6,500', estado: 'Pagado' },
                  //   { id: 2, fecha: '2023-05-01', concepto: 'Semana', monto: '$25,000', estado: 'Pagado' },
                  //   { id: 3, fecha: '2023-04-01', concepto: 'Libre', monto: '$60,000', estado: 'Pagado' },
                  // ]
                  pagos.map(pago => (
                    <tr key={pago.userID.toString()} className="border-t border-slate-600 hover:bg-slate-600">
                      <td className="py-3 px-4">
                        {pago.fecha instanceof Date 
                          ? pago.fecha.toLocaleDateString() 
                          : typeof pago.fecha === 'string' 
                            ? new Date(pago.fecha).toLocaleDateString()
                            : String(pago.fecha)}
                      </td>
                      <td className="py-3 px-4">{pago.descripcion}</td>
                      <td className="py-3 px-4">$ {pago.monto}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                          {pago.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {nuevoPago && (
        <div>
          <h1 className="text-4xl text-center font-bold text-slate-200 mt-5">
            Elige tu plan
          </h1>
          <h2 className="text-center text-slate-200">
            Puedes elegir entre las siguientes opciones
          </h2>
          
          <div className="flex flex-wrap items-center justify-center  gap-5 my-2">
            <CardPagos
              texto="Clase Individual"
              precio={6500}
              onclick={handlePago}
            />
            <CardPagos texto="Semana" precio={25000} onclick={handlePago} />
            <CardPagos texto="Quincena" precio={35000} onclick={handlePago} />
            <CardPagos texto="3 Días" precio={45000} onclick={handlePago} />
            <CardPagos texto="4 ó 5 Días" precio={50000} onclick={handlePago} />
            <CardPagos texto="Libre" precio={60000} onclick={handlePago} />
          </div>
        </div>
      )}
      </div>


      
    </div>
  );
}

export default page;
