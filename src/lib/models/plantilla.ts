import { Schema, model, models, Document } from "mongoose";
import { IPlantilla } from "@/types/plantilla";
import { Exercise, TrainingDay, TrainingDaySchema } from "@/lib/models/planillas";



// interface Exercise {
//   name: string; // Nombre del ejercicio
//   reps: string; // Repeticiones
//   sets: number; // Series
//   notas:string;
//   videoLink?: string; // Enlace al video demostrativo
// }

// const ExerciseSchema = new Schema<Exercise>(
//   {
//     name: { type: String, required: true },
//     reps: { type: String, required: true },
//     sets: { type: Number, required: true },
//     notas: {type: String, required:false},
//     videoLink: { type: String, required: false },
//   },
//   { _id: false }
// );

// interface TrainingDay {
//   day: string; // Nombre del día (e.g., "Lunes")
//   Bloque1?: Exercise[];
//   Bloque2?: Exercise[];
//   Bloque3?: Exercise[];
//   Bloque4?: Exercise[];
// }


// const TrainingDaySchema = new Schema<TrainingDay>(
//   {
//     day: { type: String, required: true },
//     Bloque1: { type: [ExerciseSchema], required: false },
//     Bloque2: { type: [ExerciseSchema], required: false },
//     Bloque3: { type: [ExerciseSchema], required: false },
//     Bloque4: { type: [ExerciseSchema], required: false },
//   },
//   { _id: false }
// );

const PlantillaSchema = new Schema<IPlantilla>(
    {
        nombre: { type: String, unique:true ,required: true },
        descripcion: { type: String, required: true },
        trainingDays: {type: [TrainingDaySchema],required: true},
    },
    { timestamps:true }
);

const Plantilla = models.Plantilla || model<IPlantilla>("Plantilla", PlantillaSchema);
export default Plantilla;