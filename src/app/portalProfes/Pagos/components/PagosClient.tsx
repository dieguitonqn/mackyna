'use client';
import { useState } from 'react';
import { IPagoPopulated } from "@/types/pago";
import PagosTable from "./PagosTable";
import ExportModal from "./ExportModal";
import { BsFiletypeCsv } from "react-icons/bs";

interface PagosClientProps {
  initialPayments: IPagoPopulated[];
}

export default function PagosClient({ initialPayments }: PagosClientProps) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end right-2 mb-10 gap-2">
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="bg-green-800 px-2 py-1 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
        >
            <BsFiletypeCsv />
          Exportar Datos
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
    </>
  );
}