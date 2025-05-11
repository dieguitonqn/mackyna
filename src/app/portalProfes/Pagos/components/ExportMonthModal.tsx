'use client';
import { useState } from 'react';
import { IPagoPopulated } from '@/types/pago';
import { BsFiletypeCsv } from "react-icons/bs";
import { createCSVContent, downloadCSV } from '@/utils/exportUtils';

interface ExportMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  payments: IPagoPopulated[];
}

export default function ExportMonthModal({ isOpen, onClose, payments }: ExportMonthModalProps) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];

  const exportToCSV = () => {
    if (!selectedMonth || !year) {
      alert('Por favor selecciona mes y año');
      return;
    }

    const startDate = new Date(`${year}-${selectedMonth}-01`);
    const endDate = new Date(parseInt(year), parseInt(selectedMonth), 0);

    const filteredPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.fecha);
      return paymentDate >= startDate && paymentDate <= endDate;
    });

    const csvContent = createCSVContent(filteredPayments);
    const fileName = `pagos_${year}_${selectedMonth}.csv`;
    downloadCSV(csvContent, fileName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-white block justify-center">Exportar Pagos Mensuales</h2>
        
        <div className="mb-4">
          <label className="block text-white mb-2">Mes</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="">Seleccionar mes</option>
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-white mb-2">Año</label>
          <input 
            type="number" 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            min="2020"
            max="2100"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button 
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
          >
            <BsFiletypeCsv className='h-5 w-5'/>
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}
