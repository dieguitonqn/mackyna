import { ObjectId } from "mongoose";


export interface IPago {
    
    userID: string;
    fecha: Date;
    monto: number;
    tipo: string;
    estado: string;
    comprobante: string;
    descripcion: string;
}