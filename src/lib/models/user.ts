import { Schema, model, models } from "mongoose"


interface IUser {
    nombre: string;
    apellido:string;
    email: string;
    pwd:string;
    rol: string;
  }

const UserSchema = new Schema(
    {
        nombre: {type: "string", required: true},
        apellido: {type: "string", required: true},
        email:{type: "string", required: true, unique: true},
        pwd:{type: "string", required: true},
        rol:{type:"string", enum: ['user', 'admin', 'teacher', ''], default:"user"}
    },
    {
        timestamps:true
    }
)

const User = models.User || model<IUser>("User", UserSchema)

export default User;