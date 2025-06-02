import { IReserva } from "@/types/reserva";
import CellDetail from '@/components/PortalProfes/Reservas/CellDetail'

interface TableCellProps {
    reservas: IReserva[];
    
    getColorClass: (cantidad: number) => string;
    dia:string;
    hora:string;
}

export function TableCell({ reservas, dia, hora, getColorClass }: TableCellProps) {
    const cantidad = reservas.length;
    
    // const [showReservas, setShowReservas] = useState(false);
     // Asegurarse de que reservas es un array y tiene la estructura esperada
    //  const segurasReservas = Array.isArray(reservas) ? reservas : [];
    // console.log(segurasReservas);

    return (
        <th className={`h-full border-2 w-24  border-slate-300 ${getColorClass(cantidad)}`}>
            <CellDetail reservas={reservas} dia={dia} hora={hora} cantidad={cantidad} />
        </th>
    );
}