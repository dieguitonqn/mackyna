import { model, Schema, models } from "mongoose";

const EjercicioSchema = new Schema ({
    nombre:{type:String, required:true},
    grupoMusc:{type:String, required:true},
    specificMusc:{type:String, required:true},
    description:{type:String},
    video:{type:String},
    
})

const Ejercicio = models.Ejercicio || model("Ejercicio",EjercicioSchema)

export default Ejercicio