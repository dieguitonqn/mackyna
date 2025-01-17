import { ObjectId } from "mongodb";

export interface IUser {
    _id:ObjectId;
    nombre: string;
    apellido?:string;
    genero?: string;
    fecha_nacimiento?: Date | null;
    localidad?: string;
    telefono?: string;
    email: string;
    pwd:string;
    rol: string;
    altura?: number | 0;
    objetivo?: string;
    lesiones?: string;
    habilitado?: boolean;
    bloqueado?: boolean;
    dias_permitidos?: number;
    ultimo_pago?: Date;
    ultima_plani?: Date;
    ultima_metrica?: Date;
    redes?: {
        Facebook?: string;
        Instagram?: string;
        Twitter?: string;    

  }};

  export interface FormUserValues {
    _id:string | '';
    nombre: string;
    apellido?: string | "";
    genero?: string | "";
    fecha_nacimiento?: Date | null;
    localidad?: string | "";
    telefono?: string | "";
    email: string;
    pwd: string;
    rol: string;
    altura?: number | 0;
    objetivo?: string | "";
    lesiones?: string | "";
    redes?: {
      Facebook?: string | "";
      Instagram?: string | "";
      Twitter?: string | "";
    };
  }