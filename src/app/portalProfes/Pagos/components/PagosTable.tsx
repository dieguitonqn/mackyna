
'use client';
import { useState } from 'react';
import { IPago } from "@/types/pago";
import OpenPDF from "@/components/PortalAlumnos/Pagos/openPDF";

export default function PagosTable({ payments }: { payments: IPago[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = payments.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="overflow-x-auto">
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
          {currentItems.map((pago, index) => (
        <tr key={index} className="hover:bg-gray-50">
          <td className="px-6 py-4 text-sm text-gray-500">
            {typeof pago.userID === 'object' && pago.userID ? 
              `${(pago.userID as any).nombre} ${(pago.userID as any).apellido}` : 
              pago.userID?.toString()}
            
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>{new Date(pago.fecha).toLocaleDateString()}</p>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>$ {pago.monto}</p>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>{pago.metodo}</p>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">

            <OpenPDF ruta={pago.comprobante as string} />
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
          <td className="px-6 py-4 text-sm text-gray-500">
            <p>{pago.descripcion}</p>
          </td>
        </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center gap-2">
        <button
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="px-4 py-2">
          Página {currentPage} de {Math.ceil(payments.length / itemsPerPage)}
        </span>
        <button
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          onClick={() => setCurrentPage(Math.min(Math.ceil(payments.length / itemsPerPage), currentPage + 1))}
          disabled={currentPage === Math.ceil(payments.length / itemsPerPage)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
