"use server";

import Turno from "./models/turnos";
import connect from "./db";
import { Turnos } from "@/types/turnos";

export const fetchTurnos = async (dia: string) => {
  // console.log(dia);
  try {
    await connect();
    const turnos = await Turno.find({
      dia_semana: dia,
      cupos_disponibles: { $gt: 0 },
    })
      .sort({
        dia_semana: 1,
        hora_inicio: 1,
      })
      .lean();
    // console.log(turnos)
    // Transformar _id a string
    const turnosConIdString: Turnos[] = turnos.map((turno) => ({
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
