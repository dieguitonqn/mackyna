import { ObjectId } from "mongoose";


export interface IPago {
    
    userID: ObjectId | string;
    nombre: string;
    email: string;
    fecha: Date;
    monto: number;
    metodo: string;
    estado: string;
    comprobante?: string;
    descripcion?: string;
}

export interface IFormPago {
    
    userID: string;
    nombre: string;
    email: string;
    fecha: Date;
    monto: number;
    metodo: string;
    estado: string;
    comprobante?: File | null;
    descripcion?: string;
}