import { Schema,  model, models } from "mongoose"



const ExerciseSchema = new Schema(
    {
      name: { type: String, required: true }, // Nombre del ejercicio
      reps: { type: String, required: true }, // Repeticiones
      sets: { type: Number, required: true }, // Series
      videoLink: { type: String, required: false }, // Enlace al video demostrativo
    },
    { _id: false } // No genera un _id para cada ejercicio (opcional)
  );
  
const PlaniSchema = new Schema(
    {
        month:{type:String, required:true},
        year:{type:String, required:true},
        userId: {type:String, required: true },
        email: { type: String, required: true },

        Bloque1: { type: [ExerciseSchema] },
        Bloque2: { type: [ExerciseSchema] },
        Bloque3: { type: [ExerciseSchema] },
        Bloque4: { type: [ExerciseSchema] },

        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },

    },
    {
        timestamps: true
    }
)

const Plani = models.Plani || model("Plani", PlaniSchema)

export default Plani;