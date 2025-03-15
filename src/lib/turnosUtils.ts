"use server";

import Turno from "./models/turnos";
import connect from "./db";
import { Turnos } from "@/types/turnos";

export const fetchTurnos = async (dia: string) => {
  console.log("llega la variable dia: " + dia);

  try {
    await connect();
    let turnos;
  
    turnos = await Turno.find({
      dia_semana: dia,
      cupos_disponibles: { $gt: 0 },
    }).lean();
  

   
    const turnosConIdString: Turnos[] = turnos
      .filter((turno) => {
        const [horaInicio, minutosInicio] = turno.hora_inicio
          .split(":")
          .map(Number);
         const horaNow = new Date().getHours();
        const minutosNow = new Date().getMinutes();

        //--

        const diaNow = new Date().getDay();
        const dias = [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sabado",
        ];


        const diaHoy = dias[diaNow];

        const diaSemanaIndex = dias.indexOf(turno.dia_semana);

        const minutosInicioTotal = horaInicio * 60 + minutosInicio;
        const minutosNowTotal = horaNow * 60 + minutosNow;
        return (
          (minutosInicioTotal - minutosNowTotal > 10 && diaSemanaIndex === dias.indexOf(diaHoy)) ||
          diaSemanaIndex > dias.indexOf(diaHoy) ||
          dias.indexOf(diaHoy) === 0 ||
          dias.indexOf(diaHoy) === 6 ||
          (dias.indexOf(diaHoy) === 5 && horaNow >= 20)
        );
      })

      .map((turno) => ({
        ...turno,
        _id: turno._id!.toString(),
        dia_semana: turno.dia_semana,
        hora_inicio: turno.hora_inicio,
        hora_fin: turno.hora_fin,
        cupos_disponibles: turno.cupos_disponibles,
      }));
    // console.log(turnosConIdString)
    return turnosConIdString;
  } catch (error: unknown) {
    console.error(error);
  }
};
