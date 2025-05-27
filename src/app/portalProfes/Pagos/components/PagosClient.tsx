'use client';
import { useState } from 'react';
import { IPagoPopulated } from "@/types/pago";
import PagosTable from "./PagosTable";
import ExportModal from "./ExportModal";
import ExportMonthModal from "./ExportMonthModal";
import { BsFiletypeCsv } from "react-icons/bs";

interface PagosClientProps {
  initialPayments: IPagoPopulated[];
}

export default function PagosClient({ initialPayments }: PagosClientProps) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExportMonthModalOpen, setIsExportMonthModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end right-2 mb-10 gap-2">
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="bg-green-800 px-2 py-1 shadow-lg shadow-gray-800 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
        >
          <BsFiletypeCsv />
          Exportar por Semana
        </button>
        <button
          onClick={() => setIsExportMonthModalOpen(true)}
          className="bg-green-800 px-2 py-1 shadow-lg shadow-gray-800 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
        >
          <BsFiletypeCsv />
          Exportar por Mes
        </button>
        <a
          href="/portalProfes/Pagos/NuevoPago"
          className="bg-blue-600 px-2 py-1 text-white rounded hover:bg-blue-500 transition-colors"
        >
          + Nuevo Pago
        </a>
      </div>
      <PagosTable payments={initialPayments} />
      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        payments={initialPayments}
      />
      <ExportMonthModal 
        isOpen={isExportMonthModalOpen}
        onClose={() => setIsExportMonthModalOpen(false)}
        payments={initialPayments}
      />
    </>
  );
}