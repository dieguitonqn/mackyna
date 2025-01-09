import { model, Schema, models } from "mongoose";


const TurnoSchema = new Schema ({
    userID:{type:String, required:true},
    fecha:{type:Date, required:true},
    hora:{type:String, required:true},
    
})

const Turno = models.Ejercicio || model("Turno",TurnoSchema)

export default Turno