
import { ObjectId } from "mongodb";
import mongoose, { Schema, model, models} from "mongoose"

const PagosSchema = new Schema(
    {
        // userID:{type: String, required: true},
        userID: {type:mongoose.Schema.Types.ObjectId, ref:'User', required: true},
        nombre: {type: String, required: true},
        email: {type: String, required: true},
        fecha: {type: Date, required: true},
        monto: {type: Number, required: true},
        metodo: {type: String, required: true},
        estado: {type: String, required: true},
        comprobante: {type: String, required: false},
        descripcion: {type: String, required: false},
    },
    {timestamps: true}
)


const Pago = models.Pago || model('Pago', PagosSchema);

export default Pago;