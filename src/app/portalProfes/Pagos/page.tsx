import React from "react";
// import AutoCompleteInput from "@/components/AutocompleteUsers";
import Pago from "@/lib/models/pagos";
import { IPago } from "@/types/pago";
import connect from "@/lib/db";
import Link from "next/link";
import { FaRegFilePdf } from "react-icons/fa";




async function Pagos() {
  
  let pagos: IPago[] = [];

  try {
    await connect();
    pagos = await Pago.find().populate('userID', 'nombre apellido');
    console.log(pagos);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Error al consultar los pagos realizados: " + err.message);
    } else {
      console.log("Error desconocido");
    }
  }

  


  return (
    <div>
      <div className="flex justify-end right-2 mb-10">

        <a 
        href="/portalProfes/Pagos/NuevoPago"
        className="bg-blue-500 px-2 py-1 text-white ">+ Nuevo Pago</a>
      </div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-50">
          <tr>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Usuario</h2>
        </td>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Fecha</h2>
        </td>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Monto</h2>
        </td>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Tipo</h2>
        </td>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Comprobante</h2>
        </td>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Estado</h2>
        </td>
        <td className="px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-600">Descripción</h2>
        </td>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {pagos.map((pago, index) => (
        <tr key={index} className="hover:bg-gray-50">
          <td className="px-6 py-4 text-sm text-gray-500">
            {typeof pago.userID === 'object' && pago.userID ? 
              `${(pago.userID as any).nombre} ${(pago.userID as any).apellido}` : 
              pago.userID?.toString()}
            
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>{pago.fecha.toLocaleDateString()}</p>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>$ {pago.monto}</p>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>{pago.metodo}</p>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>
              <Link 
              href={pago.comprobante ? `${pago.comprobante}` : "#"} 
              
              target="_blank"

              className="text-blue-500 flex items-center gap-2"
              >
              Comprobante <FaRegFilePdf className="h-5 w-5"/>
              </Link>
            </p>
          </td>
            <td className="px-6 py-4 text-sm">
            <p className={`${
              pago.estado === 'Pendiente' ? 'bg-yellow-500 text-white font-semibold px-2 py-1 rounded-sm text-center' :
              pago.estado === 'Aprobado' ? 'bg-green-500 text-white font-semibold px-2 py-1 rounded-sm text-center' :
              pago.estado === 'Rechazado' ? 'bg-red-500 text-white font-semibold px-2 py-1 rounded-sm text-center' :
              'bg-gray-500 text-white font-semibold px-2 py-1 rounded-sm text-center'
            }`}>
              {pago.estado}
            </p>
            </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>{pago.descripcion}</p>
          </td>
        </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Pagos;
