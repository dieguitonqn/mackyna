// Purpose: Model for the Config collection in the database.
import {Schema, model, models} from "mongoose";

const ConfigSchema = new Schema ({
    valorClase: {type: Number, required: true},
    valorSemana: {type: Number, required: true},
    valorQuincena: {type: Number, required: true},
    valorTresDias: {type: Number, required: true},
    valorCincoDias: {type: Number, required: true},
    valorLibre: {type: Number, required: true},
    valorDescuento: {type: Number, required: true}
})

const Config = models.Config || model("Config",ConfigSchema)

export default Config