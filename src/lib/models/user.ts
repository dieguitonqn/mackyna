import { ObjectId, Schema, model, models } from "mongoose"


interface IUser {
    _id:ObjectId;
    nombre: string;
    apellido:string;
    email: string;
    pwd:string;
    rol: string;
  }

const UserSchema = new Schema(
    {
        nombre: {type: String, required: true},
        apellido: {type: String, required: true},
        email:{type: String, required: true, unique: true},
        pwd:{type: String, required: true},
        rol:{type:String, enum: ['user', 'admin', 'teacher', ''], default:"user"}
    },
    {
        timestamps:true
    }
)

const User = models.User || model<IUser>("User", UserSchema)

export default User;