import { Schema, model, models } from "mongoose";

interface Metric {
    userID: string;
    date: Date;
    weigth: number;
    IMC: number;
    body_fat: number;
    body_musc: number;
    visceral_fat: number;
    body_age: number;

}

const Med = new Schema<Metric>(
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

const Metric = models.Metric || model<Metric>("Metric", Med);

export default Metric