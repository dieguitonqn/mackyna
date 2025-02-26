import { ObjectId } from "mongoose";


export interface IPago {
    
    userID: string;
    fecha: Date;
    monto: number;
    metodo: string;
    estado: string;
    comprobante?: File | null;
    descripcion?: string;
}