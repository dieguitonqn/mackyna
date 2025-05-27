'use client';
import { useState } from 'react';
import { IPagoPopulated } from "@/types/pago";
import OpenPDF from "@/components/PortalAlumnos/Pagos/openPDF";
// import { ObjectId } from 'mongodb';



export default function PagosTable({ payments }: { payments: IPagoPopulated[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = payments.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg p-6">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200 text-slate-200 text-xl bg-gray-700">
            <td className="px-6 py-3">
              <h2 className=" font-bold">Usuario</h2>
            </td>
            <td className="px-6 py-3">
              <h2 className=" font-bold">Fecha</h2>
            </td>
            <td className="px-6 py-3">
              <h2 className=" font-bold">Monto</h2>
            </td>
            <td className="px-6 py-3">
              <h2 className=" font-bold">Tipo</h2>
            </td>
            <td className="px-6 py-3">
              <h2 className=" font-bold">Comprobante</h2>
            </td>
            <td className="px-6 py-3">
              <h2 className=" font-bold">Estado</h2>
            </td>
            <td className="px-6 py-3">
              <h2 className=" font-bold">Descripción</h2>
            </td>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((pago, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-400 hover:text-gray-700 transition-colors duration-200 text-slate-300">
              <td className="px-6 py-4 text-sm ">
                {typeof pago.userID === 'object' && pago.userID ? 
                  `${(pago.userID ).nombre} ${(pago.userID).apellido}` : null }
                  {/* pago.userID?.toString()} */}
              </td>
              <td className="px-6 py-4 text-sm">
                <p>{new Date(pago.fecha).toLocaleDateString()}</p>
              </td>
              <td className="px-6 py-4 text-sm">
                <p>$ {pago.monto}</p>
              </td>
              <td className="px-6 py-4 text-sm">
                <p>{pago.metodo}</p>
              </td>
              <td className="px-6 py-4 text-sm">
                {pago.comprobante && pago.comprobante !== '' && pago.comprobante !== 'undefined' && pago.comprobante !== 'null' ?
                <OpenPDF ruta={pago.comprobante as string} />:
                (pago.comprobante === '' || pago.comprobante === 'undefined' || pago.comprobante === null) ? 
                  <p className="text-red-500">No hay comprobante</p> :
                  <p className="text-red-500">Comprobante no válido</p>
                }
              </td>
              <td className="px-6 py-4 text-sm">
                <p className={`${
                  pago.estado === 'Pendiente' ? 'bg-yellow-500 text-white font-semibold px-2 py-1 rounded-full text-center' :
                  pago.estado === 'Aprobado' ? 'bg-green-500 text-white font-semibold px-2 py-1 rounded-full text-center' :
                  pago.estado === 'Rechazado' ? 'bg-red-500 text-white font-semibold px-2 py-1 rounded-full text-center' :
                  'bg-gray-500 text-white font-semibold px-2 py-1 rounded-full text-center'
                }`}>
                  {pago.estado }
                </p>
              </td>
              <td className="px-6 py-4 text-sm">
                <p>{pago.descripcion}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex justify-center gap-3">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="px-4 py-2 text-sm font-medium text-gray-200">
          Página {currentPage} de {Math.ceil(payments.length / itemsPerPage)}
        </span>
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          onClick={() => setCurrentPage(Math.min(Math.ceil(payments.length / itemsPerPage), currentPage + 1))}
          disabled={currentPage === Math.ceil(payments.length / itemsPerPage)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
