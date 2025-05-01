
import React from "react";
import Pago from "@/lib/models/pagos";
import {  IPagoPopulated } from "@/types/pago";
import connect from "@/lib/db";

import PagosClient from "./components/PagosClient";



async function Pagos() {
  let pagos: IPagoPopulated[] = [];
  let payments: IPagoPopulated[] = [];

  try {
    await connect();
    pagos = await Pago.find()
      .populate('userID', 'nombre apellido')
      .sort({ fecha: -1 })
      
    

    if (!pagos) {
      throw new Error('No se encontraron pagos');
    }
    if (pagos.length === 0) {
      throw new Error('No hay pagos realizados');
    }
   
    payments = pagos.map((pago: IPagoPopulated) => ({
      ...JSON.parse(JSON.stringify(pago)),
      // ...pago,
      estado: pago.estado === 'approved' ? 'Aprobado' : 
              pago.estado === 'rejected' ? 'Rechazado' : 
              pago.estado === 'pending' ? 'Pendiente' : pago.estado,
    }));
    
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Error al consultar los pagos realizados: " + err.message);
    } else {
      console.log("Error desconocido");
    }
  }

    return (
      <>
      {/* <div className="flex justify-end right-2 mb-10">
        <a
          href="/portalProfes/Pagos/NuevoPago"
          className="bg-blue-500 px-2 py-1 text-white "
        >
          + Nuevo Pago
        </a>
      </div>
          <PagosTable payments={payments} /> */}
          <PagosClient initialPayments={payments} />
       </>
    );
  }
  

export default Pagos;