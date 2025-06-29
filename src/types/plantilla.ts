import { TrainingDay } from "@/types/plani";
import { ObjectId } from "mongodb";

export  interface IPlantilla {
    _id?: ObjectId ;
    nombre: string;
    nombreUser: string;
    descripcion: string;
    trainingDays: TrainingDay[];
    createdAt?: string;
    updatedAt?: string;   
}

export  interface IPlantillaSId {
    _id?: string ;
    nombre: string;
    nombreUser: string;
    descripcion: string;
    trainingDays: TrainingDay[];
    createdAt?: string;
    updatedAt?: string;   
}