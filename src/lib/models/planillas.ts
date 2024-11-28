import { Schema,  model, models } from "mongoose"



const ExerciseSchema = new Schema(
    {
      name: { type: String, required: true }, // Nombre del ejercicio
      reps: { type: Number, required: true }, // Repeticiones
      sets: { type: Number, required: true }, // Series
      videoLink: { type: String, required: false }, // Enlace al video demostrativo
    },
    { _id: false } // No genera un _id para cada ejercicio (opcional)
  );
  
const PlaniSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        nombre: { type: String, required: true },

        bloque1: { type: [ExerciseSchema], required: true },
        bloque2: { type: [ExerciseSchema], required: true },
        bloque3: { type: [ExerciseSchema], required: true },
        bloque4: { type: [ExerciseSchema], required: true },

        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },

    },
    {
        timestamps: true
    }
)

const Plani = models.Plani || model("Plani", PlaniSchema)

export default Plani;