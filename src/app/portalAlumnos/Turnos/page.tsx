"use client";
import { fetchTurnos } from "@/lib/turnosUtils";
import React, { useState, useEffect, use } from "react";
import { Turnos } from "@/types/turnos";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IUser } from "@/types/user";
import { IReserva } from "@/types/reserva";

function Page() {
  const { data: session } = useSession();
  const [turnos, setTurnos] = useState<Turnos[]>([]);
  const [selectedTurnos, setSelectedTurnos] = useState<{
    [dia: string]: string;
  }>({});
  const [userCupos, setUserCupos] = useState<number | null>(null);
  const [userDiasPermitidos, setUserDiasPermitidos] = useState<number | null>(
    null
  );
  const [user, setUser] = useState<IUser | null>(null);
  const [userReservasCount, setUserReservasCount] = useState<number>(0);
  const [userReservas, setUserReservas] = useState<IReserva[]>([]);
  const router = useRouter();

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  // Obtener todos los turnos al cargar la página
  useEffect(() => {
    const fetchAllTurnos = async () => {
      try {
        let turnosDB: Turnos[] = [];
        for (const dia of diasSemana) {
          const turnosDia = await fetchTurnos(dia);
          if (Array.isArray(turnosDia)) {
            turnosDB = turnosDB.concat(turnosDia);
          }
        }
        setTurnos(turnosDB);
      } catch (error) {
        console.error("Error al obtener turnos:", error);
        setTurnos([]);
      }
    };
    fetchAllTurnos();
  }, []);

  // Obtener cupos disponibles del usuario al cargar la página
  useEffect(() => {
    const fetchUserDiasPermitidos = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`/api/usuarios?id=${session.user.id}`);
        if (res.ok) {
          const user = await res.json();
          setUser(user);

          setUserDiasPermitidos(user.dias_permitidos as number);
          console.log("Cupos disponibles del usuario: ", user.dias_permitidos);
        }
      } catch (e: unknown) {
        console.error("Error al obtener usuario:", e);
        setUserCupos(null);
      }
    };
    fetchUserDiasPermitidos();

    // useEffect(() => {
    // Obtener reservas del usuario al cargar la página
    const userReservs = async () => {
      if (!session?.user?.id) return;
      console.log("Obteniendo reservas del usuario:", session.user.id);
      try {
        const res = await fetch(`/api/reservas?userID=${session.user.id}`);
        if (res.ok) {
          const reservas = await res.json();
          const reservasCount = reservas.length;

          if (reservasCount > 0) {
            setSelectedTurnos(
              reservas.reduce(
                (acc: { [dia: string]: string }, reserva: IReserva) => {
                  acc[reserva.turnoInfo.dia_semana] = reserva.turnoInfo.turnoId;
                  return acc;
                },
                {}
              )
            );
            console.log("Turnos seleccionados:", selectedTurnos);
            console.log("Reservas del usuario:", reservas);
          }
          setUserReservasCount(reservasCount);
          setUserReservas(reservas);
          setUserCupos(
            userDiasPermitidos ? userDiasPermitidos - reservasCount : null
          );
          console.log(
            "Reservas del usuario obtenidas: ",
            reservasCount,
            reservas
          );
        } else {
          console.error(
            "Error al obtener reservas del usuario:",
            res.statusText
          );
        }
      } catch (e) {
        console.error("Error al obtener reservas del usuario:", e);
        setUserCupos(null);
      }
    };

    userReservs();
    console.log("Reservas del usuario obtenidas: ", userReservasCount);
  }, [session?.user?.id]);

  useEffect(() => {
    // Actualizar los cupos disponibles al cambiar las reservas del usuario
    if (userDiasPermitidos !== null) {
      setUserCupos(userDiasPermitidos - userReservasCount);
    } else {
      setUserCupos(null);
    }
  }, [userDiasPermitidos, userReservasCount]);
  // Agrupar turnos por día
  const turnosPorDia: { [dia: string]: Turnos[] } = turnos.reduce(
    (acc, turno) => {
      if (!acc[turno.dia_semana]) acc[turno.dia_semana] = [];
      acc[turno.dia_semana].push(turno);
      return acc;
    },
    {} as { [dia: string]: Turnos[] }
  );

  // Manejar selección de turnos (uno por día, sin superar cupos)
  const handleTurnoButton = (dia: string, turnoId: string) => {
    console.log("Turno seleccionado:", dia, turnoId);

    const seleccionados = Object.values(selectedTurnos).filter(Boolean).length;
    
    const userCupos = userDiasPermitidos
      ? userDiasPermitidos - seleccionados
      : null;
    console.log("Cupos disponibles del usuario:", userCupos);
    console.log("Seleccionados:", seleccionados);
    console.log("selectedTurnos:", selectedTurnos);
    setUserCupos(userCupos);
    // Si ya está seleccionado, deselecciona
    if (selectedTurnos[dia] === turnoId) {
      setSelectedTurnos((prev) => ({ ...prev, [dia]: "" }));
      // Aumentar cupo al deseleccionar
      setUserCupos((prev) => (prev !== null ? prev + 1 : null));
      return;
    }
    if (userCupos !== null && userDiasPermitidos !==null && seleccionados > userDiasPermitidos - 1) {
      alert("No puedes seleccionar más turnos de los permitidos.");
      return;
    }
    console.log("Selected turnos:", selectedTurnos);
    // Restar cupo al seleccionar
    setUserCupos((prev) => (prev !== null ? prev - 1 : null));
    // No permitir seleccionar más turnos que el cupo

    setSelectedTurnos((prev) => ({ ...prev, [dia]: turnoId }));
  };

  // Reservar todos los turnos seleccionados
  const handleReservaMultiple = async () => {
    const turnosAReservar = Object.values(selectedTurnos).filter(Boolean);
    if (turnosAReservar.length === 0) {
      const confirmed = confirm("Debe seleccionar al menos un turno, de lo contrario se eliminarán sus reservas.¿Estás seguro que deseas eliminar todas tus reservas?");
      if (!confirmed) return;
    }
    try {
      const reserva = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: session?.user.id,
          turnoIDs: turnosAReservar,
        }),
      });

      if (reserva.ok) {
        const data = await reserva.json();
        const dias_disp = data.dias_disp;
        alert(
          `Reservas guardadas exitosamente. Te quedan ${dias_disp} días disponibles.`
        );
        // setSelectedTurnos({});
      } else if (reserva.status === 401) {
        alert(
          "Ocurrió un error al crear la reserva. Usted no tiene más cupo disponible."
        );
      } else if (reserva.status === 400) {
        alert(
          "No tiene configurado el cupo disponible. Por favor, contactese con su profesor para solucionar este inconveniente."
        );
      } else if (reserva.status === 402) {
        alert("No hay cupos disponibles. Por favor, seleccione otro turno.");
      } else if (reserva.status === 403) {
        alert(
          "Ya tienes una reserva en uno de estos turnos. Por favor, selecciona otros turnos."
        );
      }
      router.refresh();
    } catch (error: unknown) {
      console.error("Error:", error);
      alert(
        "Ocurrió un error inesperado. Por favor, contacta con el administrador."
      );
    }
  };

  return (
    <div className="h-full md:h-full my-10 p-5">
      <div className="flex justify-center items-center text-slate-300 text-5xl font-bold mt-10">
        Mis reservas
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-7xl">
          <div className="mb-2 text-right text-sm text-gray-600">
            {userCupos !== null
              ? `Cupos disponibles: ${
                  userCupos
                  // Object.values(selectedTurnos).filter(Boolean).length
                }`
              : "Cupos disponibles: ..."}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {diasSemana.map((dia) => (
              <div
                key={dia}
                className="bg-slate-100 rounded-md p-4 shadow-md min-h-[200px] flex flex-col"
              >
                <div className="font-semibold text-center mb-2">{dia}</div>
                {turnosPorDia[dia] && turnosPorDia[dia].length > 0 ? (
                  turnosPorDia[dia].map((turno) => {
                    const seleccionado = selectedTurnos[dia] === turno._id;
                    return (
                      <button
                        key={turno._id}
                        onClick={() => handleTurnoButton(dia, turno._id)}
                        disabled={turno.cupos_disponibles <= 0}
                        className={`w-full text-left px-3 py-2 mb-2 rounded transition-colors border flex items-center justify-between
                          ${
                            seleccionado
                              ? "bg-green-700 text-white border-green-800"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"
                          }
                          ${
                            turno.cupos_disponibles <= 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                      >
                        <span>
                          {turno.hora_inicio} - {turno.hora_fin}{" "}
                          <span className={`text-xs text-gray-500
                            ${seleccionado? "text-white":""}
                            `}>
                            ({turno.cupos_disponibles} cupos)
                          </span>
                        </span>
                        {seleccionado && (
                          <span className="ml-2 font-bold">✓</span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <span className="text-gray-400 text-sm text-center">
                    Sin turnos
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-700/20 text-white px-6 py-2 border-gray-200 border rounded-md text-lg shadow-md hover:bg-green-800 disabled:bg-gray-400"
              onClick={handleReservaMultiple}
              // disabled={
              //   // Object.values(selectedTurnos).filter(Boolean).length === 0
               
              // }
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
