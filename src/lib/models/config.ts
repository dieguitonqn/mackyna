// Purpose: Model for the Config collection in the database.
import {Schema, model, models} from "mongoose";

const ConfigSchema = new Schema ({
    valorClase:{type:Number, required:true},
    valorDia:{type:Number, required:true},
    valor4dias:{type:Number, required:true},
    valor5dias:{type:Number, required:true},
    valorLibre:{type:Number, required:true}
})

const Config = models.Config || model("Config",ConfigSchema)

export default Config