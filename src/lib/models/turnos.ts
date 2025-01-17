import { model, Schema, models } from "mongoose";


const TurnoSchema = new Schema ({
    dia_semana:{type:String, required:true },
    hora_inicio:{type:String, required:true},
    hora_fin:{type:String, required:true},
    cupos_disponibles:{type:Number, required:true},
    
})

const Turno = models.Turno || model("Turno",TurnoSchema)

export default Turno