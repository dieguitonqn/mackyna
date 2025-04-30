'use client';
import { useState } from 'react';
import { IPagoPopulated } from '@/types/pago';
import { BsFiletypeCsv } from "react-icons/bs";
// import { ObjectId } from 'mongodb';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  payments: IPagoPopulated[];
}



export default function ExportModal({ isOpen, onClose, payments }: ExportModalProps) {
  const [weekStart, setWeekStart] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const getWeeksInYear = (year: number) => {
    const weeks = [];
    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year, 11, 31);
    
    const currentDate = firstDayOfYear;
    while (currentDate <= lastDayOfYear) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      weeks.push({
        value: currentDate.toISOString().split('T')[0],
        label: `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`
      });
      
      currentDate.setDate(currentDate.getDate() + 7);
    }
    return weeks;
  };

  const exportToCSV = () => {
    if (!weekStart || !year) {
      alert('Por favor selecciona semana y año');
      return;
    }

    const selectedWeekStart = new Date(weekStart);
    const selectedWeekEnd = new Date(weekStart);
    selectedWeekEnd.setDate(selectedWeekEnd.getDate() + 6);

    // Filtrar pagos por semana
    const filteredPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.fecha);
      return paymentDate >= selectedWeekStart && paymentDate <= selectedWeekEnd;
    });

    // Crear contenido CSV
    const headers = ['Usuario', 'Fecha', 'Monto', 'Método', 'Estado', 'Descripción'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(payment => {
        const user = typeof payment.userID === 'object' && payment.userID ? 
          `${(payment.userID ).nombre} ${(payment.userID).apellido}`: null ;
          // : 
          // payment.userID?.toString();
        
        return [
          user,
          new Date(payment.fecha).toLocaleDateString(),
          payment.monto,
          payment.metodo,
          payment.estado,
          payment.descripcion
        ].join(',');
      })
    ].join('\n');

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const fileName = `pagos_${selectedWeekStart.toISOString().split('T')[0]}_${selectedWeekEnd.toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const weeks = getWeeksInYear(parseInt(year));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-white block justify-center">  Exportar Pagos</h2>
        
        <div className="mb-4">
          <label className="block text-white mb-2">Semana</label>
          <select 
            value={weekStart} 
            onChange={(e) => setWeekStart(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="">Seleccionar semana</option>
            {weeks.map(week => (
              <option key={week.value} value={week.value}>{week.label}</option>
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