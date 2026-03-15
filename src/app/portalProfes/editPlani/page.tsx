"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Exercise, Plani } from "@/types/plani";

import ExerciseForm from "@/components/ExerciseForm";
import { IUser } from "@/types/user";
import { IPlantillaSId } from "@/types/plantilla";
import clientLogger from "@/lib/clientLogger";
import usePlanilla from "@/app/stores/store.plani";

const EMPTY_PLANILLA: Plani = {
  month: "",
  year: "",
  userId: "",
  email: "",
  trainingDays: [],
  startDate: "",
  endDate: "",
};

const EditPlani = () => {
  const searchParams = useSearchParams();
  const queryPlaniID = searchParams.get("planiID");
  const queryPlantillaID = searchParams.get("plantillaID");
  const [plani, setPlani] = useState<Plani>();
  const [user, setUser] = useState<IUser>();

  const planilla = usePlanilla((state) => state.planilla);
  const setPlanilla = usePlanilla((state) => state.setPlanilla);
  const setTrainingDays = usePlanilla((state) => state.setTrainingDays);
  const setDays = usePlanilla((state) => state.setDays);
  const setStartDate = usePlanilla((state) => state.setStartDate);
  const setEndDate = usePlanilla((state) => state.setEndDate);

  const [editedPlanti, setEditedPlanti] = useState<IPlantillaSId>({
    nombre: "",
    nombreUser: "",
    descripcion: "",
    _id: "",
    createdAt: "",
    updatedAt: "",
    trainingDays: [],
  });

  useEffect(() => {
    setPlanilla(EMPTY_PLANILLA);
    setDays(1);

    // Si tenemos un planiID, cargamos la plani existente
    if (queryPlaniID) {
      fetch(`/api/planillas?planiID=${queryPlaniID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error fetching plani");
          }
          return response.json();
        })
        .then((data) => {
          // console.log("Plani data:", data);
          setPlani(data);
          setPlanilla(JSON.parse(JSON.stringify(data))); // Crear una copia profunda de data
          setDays(data?.trainingDays?.length || 1);
        })
        .catch((error) => console.error("Error fetching plani:", error));
    }
    // Si tenemos un plantillaID, cargamos la plantilla
    else if (queryPlantillaID) {
      fetch(
        `/portalProfes/Plantillas/api/plantillas?plantillaID=${queryPlantillaID}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error fetching plantilla");
          }
          return response.json();
        })
        .then((data) => {
          // console.log("Plantilla data:", data);
          if (data && data.trainingDays) {
            setTrainingDays(data.trainingDays);
            setDays(data.trainingDays.length || 1);
            setEditedPlanti(data);
            // console.log(editedPlani);
          } else {
            setTrainingDays([]);
            setDays(1);
          }
        })
        .catch((error) => console.error("Error fetching plantilla:", error));
    }
  }, [queryPlantillaID, queryPlaniID, setDays, setPlanilla, setTrainingDays]);

  useEffect(() => {
    return () => {
      setPlanilla(EMPTY_PLANILLA);
      setDays(1);
    };
  }, [setDays, setPlanilla]);

  useEffect(() => {
    if (plani) {
      fetch(`/api/usuarios?id=${plani.userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error fetching user");
          }
          return response.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [plani]);

  // if (!plani || !editedPlani) {
  //   return <div>Cargando...</div>;
  // }

  const handlePlaniChange = (field: string, value: string | number) => {
    setPlanilla({
      ...planilla,
      [field]: value,
    });
  };

  // Agregar un nuevo ejercicio al bloque indicado

  // Actualización: handleAddDay recibe el largo actual y verifica que no supere 5 días.
  const handleAddDay = (
    e: React.MouseEvent<HTMLButtonElement>,
    currentLength: number
  ) => {
    e.preventDefault();
    // console.log('currentLength:', currentLength);
    if (currentLength >= 6) {
      alert("No se pueden agregar más de 6 días");
      return;
    }
    const nextDayNumber = currentLength + 1;
    const newDay = {
      day: "Día " + nextDayNumber,
      Bloque1: [] as Exercise[],
      Bloque2: [] as Exercise[],
      Bloque3: [] as Exercise[],
      Bloque4: [] as Exercise[],
    };
    const updatedDays = [...(planilla.trainingDays || []), newDay].map(
      (day, index) => ({
        ...day,
        day: `Día ${index + 1}`,
      })
    );
    setTrainingDays(updatedDays);
    setDays(updatedDays.length);
  };

  // Función para borrar un día
  const handleDeleteDay = (
    e: React.MouseEvent<HTMLButtonElement>,
    dayIndex: number
  ) => {
    e.preventDefault();
    const updatedDays = (planilla.trainingDays || [])
      .filter((_, index) => index !== dayIndex)
      .map((day, index) => ({
        ...day,
        day: `Día ${index + 1}`,
      }));

    setTrainingDays(updatedDays);
    setDays(updatedDays.length || 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (queryPlaniID && plani) {
      try {
        clientLogger.debug("Updating plani with ID:", plani._id);
        clientLogger.debug("Updated plani data:", planilla);
        const response = await fetch(`/api/planillas?planiID=${queryPlaniID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: plani._id?.toString() || queryPlaniID,
            plani: planilla,
          }),
        });
        if (!response.ok) {
          throw new Error("Error al actualizar planilla");
        }
        alert("Planilla actualizada correctamente");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error al actualizar planilla:", error);
          alert("Error al actualizar planilla");
        }
      }
    } else if (queryPlantillaID) {
      try {
        const response = await fetch(
          `/portalProfes/Plantillas/api/plantillas`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: queryPlantillaID,
              nombre: editedPlanti.nombre,
              nombreUser: editedPlanti.nombreUser,
              descripcion: editedPlanti.descripcion,
              trainingDays: planilla.trainingDays,
              _id: editedPlanti._id,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Error al actualizar plantilla");
        }
        alert("Plantilla actualizada correctamente");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error al actualizar plantilla:", error);
          alert("Error al actualizar plantilla");
        }
      }
    }
  };

  const trainingDays = planilla.trainingDays || [];

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit}>
          {queryPlaniID && (
            <h1 className="text-3xl font-bold mb-4 text-slate-300 text-center">
              Editar planilla de {user?.nombre} {user?.apellido}
            </h1>
          )}
          {queryPlantillaID && (
            <div className="bg-slate-500/30 p-6 rounded-lg shadow-lg mb-8">
              <h1 className="text-3xl font-bold mb-6 text-slate-200 text-center">
                Editar plantilla de <span className="text-emerald-400">{editedPlanti.nombreUser}</span>
              </h1>
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <p className="text-lg text-slate-300 font-semibold">
                    Nombre de la plantilla:
                  </p>
                  <p className="text-xl text-emerald-400">{editedPlanti.nombre}</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-lg text-slate-300 font-semibold">
                    Descripción:
                  </p>
                  <p className="text-xl text-emerald-400">{editedPlanti.descripcion}</p>
                </div>
              </div>
            </div>
          )}
          {/* Aquí puedes agregar un formulario para editar la planilla */}
          {!queryPlantillaID && (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Mes
              </label>
              <input
                type="text"
                value={planilla.month}
                onChange={(e) => handlePlaniChange("month", e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-slate-900/80"
              />
            </div>
          )}
          {!queryPlantillaID && (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Año
              </label>
              <input
                type="text"
                value={planilla.year}
                onChange={(e) => handlePlaniChange("year", e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-slate-900/80"
              />
            </div>
          )}
          {!queryPlantillaID && (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Fecha de Inicio
              </label>

              <input
                type="date"
                value={
                  planilla.startDate
                    ? new Date(planilla.startDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setStartDate(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-slate-900/80"
              />
            </div>
          )}
          {!queryPlantillaID && (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Fecha de Fin
              </label>

              <input
                type="date"
                value={
                  planilla.endDate
                    ? new Date(planilla.endDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setEndDate(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-slate-900/80"
              />
            </div>
          )}
          {trainingDays.map((trainingDay, dayIndex) => (
            <div
              className="flex flex-col items-center  bg-slate-500/30 my-5 p-2"
              key={dayIndex}
            >
              <h2 className="text-2xl font-bold mb-2">{trainingDay.day}</h2>
              <div
                key={dayIndex * 10}
                className="my-6 grid grid-cols-4 gap-4 items-start"
              >
                {trainingDay.Bloque1 !== undefined && (
                  <div>
                    <ExerciseForm
                      day={trainingDay.day}
                      bloque="Bloque1"
                      initialExercises={trainingDay.Bloque1}
                    />
                  </div>
                )}
                {trainingDay.Bloque2 !== undefined && (
                  <div>
                    <ExerciseForm
                      day={trainingDay.day}
                      bloque="Bloque2"
                      initialExercises={trainingDay.Bloque2}
                    />
                  </div>
                )}
                {trainingDay.Bloque3 !== undefined && (
                  <div>
                    <ExerciseForm
                      day={trainingDay.day}
                      bloque="Bloque3"
                      initialExercises={trainingDay.Bloque3}
                    />
                  </div>
                )}
                {trainingDay.Bloque4 !== undefined && (
                  <div>
                    <ExerciseForm
                      day={trainingDay.day}
                      bloque="Bloque4"
                      initialExercises={trainingDay.Bloque4}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={(e) => handleDeleteDay(e, dayIndex)}
                className="bg-red-500/50 px-2 py-1 m-2 rounded-md"
              >
                Borrar Día
              </button>
            </div>
          ))}

          <button
            onClick={(e) => handleAddDay(e, trainingDays.length)}
            className="flex m-auto bg-blue-500/60 px-2 py-1 rounded-md my-4"
          >
            Agregar Día
          </button>
          {!queryPlantillaID && (
            <button className="flex m-auto bg-green-600/60 px-2 py-1 rounded-md">
              Guardar
            </button>
          )}
          {queryPlantillaID && (
            <button className="flex m-auto bg-green-600/60 px-2 py-1 rounded-md">
              Guardar Plantilla
            </button>
          )}
        </form>
      </div>
    );
  };

const EditPlaniPage = () => (
  <Suspense fallback={<div>Cargando...</div>}>
    <EditPlani />
  </Suspense>
);
export default EditPlaniPage;
