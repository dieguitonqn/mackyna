import { ObjectId, Schema, model, models } from "mongoose"



interface IUser {
    _id:ObjectId;
    nombre: string;
    apellido:string;
    genero: string;
    fecha_nacimiento: Date;
    localidad: string;
    telefono: string;
    email: string;
    pwd:string;
    rol: string;
    altura: number;
    objetivo: string;
    lesiones: string;
    habilitado: boolean;
    bloqueado: boolean;
    dias_permitidos: number;
    ultimo_pago: Date;
    ultima_plani: Date;
    ultima_metrica: Date;

    redes: {
        Facebook: string;
        Instagram: string;
        Twitter: string;    

  }};
  
  const RedesSchema = new Schema(
    {
        Facebook: {type:String, required:false},
        Instagram: {type:String, required:false},
        Twitter: {type:String, required:false},
    },
    {_id:false}
  )

const UserSchema = new Schema(
    {
        nombre: {type: String, required: true},
        apellido: {type: String, required: true},
        genero:{type:String, enum: ['Masculino', 'Femenino', 'Otro'], required:false},
        fecha_nacimiento: {type: Date, required: false},
        localidad:{type: String, required:false},
        telefono:{type: String, required:false},
        email:{type: String, required: true, unique: true},
        pwd:{type: String, required: true},
        rol:{type:String, enum: ['user', 'admin', 'teacher', ''], default:"user"},
        altura:{type: Number, required:false},
        objetivo:{type: String, required:false},
        lesiones:{type: String, required:false},
        habilitado:{type: Boolean, required:false, default:false},
        bloqueado:{type: Boolean, required:false, default:false},
        dias_permitidos:{type: Number, required:false},
        ultimo_pago:{type: Date, required:false},
        ultima_plani:{type: Date, required:false},
        ultima_metrica:{type: Date, required:false},
        redes:{type: RedesSchema, required:false},

    },
    {
        timestamps:true
    }
)

const User = models.User || model<IUser>("User", UserSchema)

export default User;