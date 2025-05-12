import React from "react";
import Pago from "@/lib/models/pagos";
import { IPagoPopulated } from "@/types/pago";
import connect from "@/lib/db";

import PagosClient from "./components/PagosClient";

export async function getServerSideProps() {
  try {
    await connect();
    const pagos = await Pago.find()
      .populate('userID', 'nombre apellido')
      .sort({ fecha: -1 });

    if (!pagos || pagos.length === 0) {
      throw new Error('No hay pagos realizados');
    }

    const payments = pagos.map((pago: IPagoPopulated) => ({
      ...JSON.parse(JSON.stringify(pago)),
      estado: pago.estado === 'approved' ? 'Aprobado' : 
              pago.estado === 'rejected' ? 'Rechazado' : 
              pago.estado === 'pending' ? 'Pendiente' : pago.estado,
    }));

    return { props: { payments } };
  } catch (err) {
    console.error("Error al consultar los pagos realizados:", err);
    return { props: { payments: [] } };
  }
}

const Pagos = ({ payments }: { payments: IPagoPopulated[] }) => {
  return (
    <>
      <PagosClient initialPayments={payments} />
    </>
  );
};

export default Pagos;