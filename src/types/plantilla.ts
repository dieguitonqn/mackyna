import { TrainingDay } from "@/types/plani";
import { ObjectId } from "mongodb";

export  interface IPlantilla {
    _id?: ObjectId ;
    nombre: string;
    descripcion: string;
    trainingDays: TrainingDay[];
    createdAt?: string;
    updatedAt?: string;   
}