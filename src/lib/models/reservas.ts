import { model, Schema, models } from "mongoose";

const userData = new Schema(
    {
        userId: { type: String, required: true },
        nombre: { type: String, required: true },
        apellido: { type: String, required: true },

    },
    { _id: false }
)

const turnoData = new Schema(
    {
        turnoId: { type: String, required: true },
        dia_semana: { type: String, required: true },
        hora_inicio: { type: String, required: true },
        hora_fin: { type: String, required: true },
    },
    { _id: false }
)

const ReservaSchema = new Schema({
    userInfo: { type: userData, required: true },
    turnoInfo: { type: turnoData, required: true },
    fecha: { type: Date, required: true },
    estado: { type: String, required: true },
    observaciones: { type: String },

})

const Reserva = models.Reserva || model("Reserva", ReservaSchema)

export default Reserva;