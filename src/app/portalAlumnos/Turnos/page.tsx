"use client";
import { fetchTurnos } from "@/lib/turnosUtils";
import React, { useState, useEffect, use } from "react";
import { Turnos } from "@/types/turnos";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IUser } from "@/types/user";
import { set } from "mongoose";

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
  const [userReservas, setUserReservas] = useState<number>(0);
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
    const fetchUserCupos = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`/api/usuarios?id=${session.user.id}`);
        if (res.ok) {
          const user = await res.json();
          setUser(user);

          setUserDiasPermitidos(user.dias_permitidos as number);
        }
      } catch (e: unknown) {
        console.error("Error al obtener usuario:", e);
        setUserCupos(null);
      }
    };
    fetchUserCupos();

    // useEffect(() => {
    const userReservas = async () => {
      if (!session?.user?.id) return;
      console.log("Obteniendo reservas del usuario:", session.user.id);
      try {
        const res = await fetch(`/api/reservas?userID=${session.user.id}`);
        if (res.ok) {
          const reservas = await res.json();
          const reservasCount = reservas.length;

          setUserReservas(reservasCount);
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

    userReservas();
  }, [session?.user?.id]);

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
    const seleccionados = Object.values(selectedTurnos).filter(Boolean).length;
    console.log(userDiasPermitidos, userReservas);
    const userCupos = userDiasPermitidos
      ? userDiasPermitidos - userReservas - seleccionados
      : null;
    console.log(userCupos, selectedTurnos);
    setUserCupos(userCupos);
    // Si ya está seleccionado, deselecciona
    if (selectedTurnos[dia] === turnoId) {
      setSelectedTurnos((prev) => ({ ...prev, [dia]: "" }));
       // Aumentar cupo al deseleccionar
      userCupos? setUserCupos(userCupos +1):null;
      return;
    }
    // No permitir seleccionar más turnos que el cupo

    if (userCupos !== null && seleccionados >= userCupos) {
      alert("No puedes seleccionar más turnos de los permitidos.");
      return;
    }
    setSelectedTurnos((prev) => ({ ...prev, [dia]: turnoId }));
  };

  // Reservar todos los turnos seleccionados
  const handleReservaMultiple = async () => {
    const turnosAReservar = Object.values(selectedTurnos).filter(Boolean);
    if (turnosAReservar.length === 0) {
      alert("Selecciona al menos un turno para reservar.");
      return;
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
          `Reservas creadas exitosamente. Te quedan ${dias_disp} días disponibles.`
        );
        setSelectedTurnos({});
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
    <div className="h-full md:h-screen">
      <h2 className="text-2xl font-bold mb-4">Turnos</h2>
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
                          <span className="text-xs text-gray-500">
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
              className="bg-green-700/80 text-white px-6 py-2 rounded-md text-lg shadow-md hover:bg-green-800 disabled:bg-gray-400"
              onClick={handleReservaMultiple}
              disabled={
                Object.values(selectedTurnos).filter(Boolean).length === 0
              }
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
