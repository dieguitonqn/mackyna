'use client';
import React, { useState } from "react";
import Pago from "@/lib/models/pagos";
import { IPago } from "@/types/pago";
import connect from "@/lib/db";
import OpenPDF from "@/components/PortalAlumnos/Pagos/openPDF";
import { FaRegFilePdf } from "react-icons/fa";

// Número de elementos por página
const ITEMS_PER_PAGE = 10;

async function Pagos() {
  let pagos: IPago[] = [];
  let payments: IPago[] = [];

  try {
    const response = await fetch('/api/pagos');
    if (!response.ok) {
      throw new Error('Error al obtener los pagos');
    }
    const data = await response.json();
    payments = data.map((pago: IPago) => ({
      ...pago,
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

  // Componente de paginación
  const Pagination = ({ totalItems }: { totalItems: number }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    // Calcular los ítems para la página actual
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = payments.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };

    // Generar rango de páginas para mostrar
    const getPageRange = () => {
      const range = [];
      const maxVisiblePages = 5; // Número máximo de páginas visibles en la paginación
      
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      // Ajustar si estamos cerca del final
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      
      return range;
    };

    return (
      <>
        {/* Tabla con los elementos de la página actual */}
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

        {/* Controles de paginación */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} resultados
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              {"<<"}
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              {"<"}
            </button>
            
            {getPageRange().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              {">"}
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              {">>"}
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="flex justify-end right-2 mb-10">
        <a 
          href="/portalProfes/Pagos/NuevoPago"
          className="bg-blue-500 px-2 py-1 text-white"
        >
          + Nuevo Pago
        </a>
      </div>
      
      {/* Renderizar el componente de paginación */}
      <Pagination totalItems={payments.length} />
    </div>
  );
}

export default Pagos;