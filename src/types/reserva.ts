
export interface IReserva {
    userInfo :{
        userId:string,
        nombre:string,
        apellido:string
    },
    turnoInfo :{
        turnoId:string,
        dia_semana:string,
        hora_inicio:string,
        hora_fin:string,
        cupos_disponibles?:number
    }
    fecha : Date,
    estado: string,
    observaciones: string
}

export interface IReservaConId extends IReserva{
    _id:string
}