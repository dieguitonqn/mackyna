import { Schema, model, models } from "mongoose"

const PlaniSchema = new Schema(
    {
        nombre: {type: "string", required: true, unique: true},
        apellido: {type: "string", required: true, unique: true},
        email:{type: "string", required: true, unique: true},
        pwd:{type: "string", required: true, unique: true},
    },
    {
        timestamps:true
    }
)

const Plani = models.Plani || model("Plani", PlaniSchema)

export default Plani;