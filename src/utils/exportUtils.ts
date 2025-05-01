import { IPagoPopulated } from '@/types/pago';

export const createCSVContent = (filteredPayments: IPagoPopulated[]) => {
  const headers = ['Usuario', 'Fecha', 'Monto', 'Método', 'Estado', 'Descripción'];
  return [
    headers.join(','),
    ...filteredPayments.map(payment => {
      const user = typeof payment.userID === 'object' && payment.userID ? 
        `${payment.userID.nombre} ${payment.userID.apellido}` : null;
      
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
};

export const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
