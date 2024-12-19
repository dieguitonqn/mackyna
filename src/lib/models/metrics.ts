import { Schema, model, models } from "mongoose";

interface Medicion {
    userID: string;
    date: Date;
    weigth: number;
    IMC: number;
    body_fat: number;
    body_musc: number;
    visceral_fat: number;
    body_age: number;

}

const Med = new Schema<Medicion>(
    {
        userID: { type: String, required: true },

        date: { type: Date, required: true },
        weigth: { type: Number, required: true },
        IMC: { type: Number, required: true },
        body_fat: { type: Number, required: true },
        body_musc: { type: Number, required: true },
        visceral_fat: { type: Number, required: true },
        body_age: { type: Number, required: true },

    },
    {
        timestamps: true
    }


)

const Medicion = models.Medicion || model<Medicion>("Medicion", Med);

export default Medicion