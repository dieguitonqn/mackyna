import { Schema, model, models } from "mongoose"

const UserSchema = new Schema(
    {
        nombre: {type: "string", required: true},
        apellido: {type: "string", required: true},
        email:{type: "string", required: true, unique: true},
        pwd:{type: "string", required: true},
        rol:{type:"string"}
    },
    {
        timestamps:true
    }
)

const User = models.User || model("User", UserSchema)

export default User;