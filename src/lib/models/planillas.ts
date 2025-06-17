import { Schema, model, models, Document } from "mongoose";

export interface Exercise {
  name: string; // Nombre del ejercicio
  reps: string; // Repeticiones
  sets: number; // Series
  notas:string;
  videoLink?: string; // Enlace al video demostrativo
}

export const ExerciseSchema = new Schema<Exercise>(
  {
    name: { type: String, required: true },
    reps: { type: String, required: true },
    sets: { type: Number, required: true },
    notas: {type: String, required:false},
    videoLink: { type: String, required: false },
  },
  { _id: false }
);

export interface TrainingDay {
  day: string; // Nombre del día (e.g., "Lunes")
  Bloque1?: Exercise[];
  Bloque2?: Exercise[];
  Bloque3?: Exercise[];
  Bloque4?: Exercise[];
}

export const TrainingDaySchema = new Schema<TrainingDay>(
  {
    day: { type: String, required: true },
    Bloque1: { type: [ExerciseSchema], required: false },
    Bloque2: { type: [ExerciseSchema], required: false },
    Bloque3: { type: [ExerciseSchema], required: false },
    Bloque4: { type: [ExerciseSchema], required: false },
  },
  { _id: false }
);

interface Plani extends Document {
  month: string;
  year: string;
  userId: string;
  email: string;
  trainingDays: TrainingDay[];
  startDate: Date;
  endDate: Date;
}

const PlaniSchema = new Schema<Plani>(
  {
    month: { type: String, required: true },
    year: { type: String, required: true },
    userId: { type: String, required: true },
    email: { type: String, required: true },
    trainingDays: {
      type: [TrainingDaySchema],
      validate: [
        {
          validator: (v: TrainingDay[]) => v.length <= 5, // Máximo 5 días de entrenamiento
          message: "No puedes agregar más de 5 días de entrenamiento."
        },
      ],
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Plani = models.Plani || model<Plani>("Plani", PlaniSchema);

export default Plani;
