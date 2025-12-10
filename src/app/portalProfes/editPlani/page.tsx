"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Exercise, Plani } from "@/types/plani";

import ExerciseForm from "@/components/ExerciseForm";
import { IUser } from "@/types/user";
import { IPlantillaSId } from "@/types/plantilla";
import { set } from "mongoose";
import clientLogger from "@/lib/clientLogger";

const EditPlani = () => {
  const searchParams = useSearchParams();
  const queryPlaniID = searchParams.get("planiID");
  const queryPlantillaID = searchParams.get("plantillaID");
  const [plani, setPlani] = useState<Plani>();
  const [user, setUser] = useState<IUser>();
  // const queryPlantillaUserID = searchParams.get("userID");

  // Estado para la planilla editada
  const [editedPlani, setEditedPlani] = useState<Plani>({
    month: "",
    year: "",
    userId: "",
    email: "",
    trainingDays: [],
    startDate: "",
    endDate: "",
  });
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
          setEditedPlani(JSON.parse(JSON.stringify(data))); // Crear una copia profunda de data
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
            setEditedPlani((prev) => ({
              ...prev,
              trainingDays: data.trainingDays,
            }));
            setEditedPlanti(data);
            // console.log(editedPlani);
          }
        })
        .catch((error) => console.error("Error fetching plantilla:", error));
    }
  }, [queryPlantillaID, queryPlaniID]);

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
    setEditedPlani({
      ...editedPlani,
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
    if (currentLength >= 5) {
      alert("No se pueden agregar más de 5 días");
      return;
    }
    currentLength++;
    const newDay = {
      day: "Día " + currentLength,
      Bloque1: [] as Exercise[],
      Bloque2: [] as Exercise[],
      Bloque3: [] as Exercise[],
      Bloque4: [] as Exercise[],
    };
    setEditedPlani({
      ...editedPlani,
      trainingDays: [...editedPlani.trainingDays, newDay],
    });
  };

  // Función para borrar un día
  const handleDeleteDay = (
    e: React.MouseEvent<HTMLButtonElement>,
    dayIndex: number
  ) => {
    e.preventDefault();
    const updatedDays = editedPlani.trainingDays.filter(
      (_, index) => index !== dayIndex
    );
    setEditedPlani({
      ...editedPlani,
      trainingDays: updatedDays,
    });
  };

  const handleInputChange2 = (
    day: string,
    bloque: string,
    exercises: Exercise[]
  ) => {
    const dayIndex = parseInt(day.split(" ")[1]) - 1;

    if (dayIndex < 0 || dayIndex >= editedPlani.trainingDays.length) {
      console.error("Invalid day index");
      return;
    }

    const updatedTrainingDays = editedPlani.trainingDays.map(
      (trainingDay, index) =>
        index === dayIndex
          ? { ...trainingDay, [bloque]: exercises }
          : trainingDay
    );

    setEditedPlani({
      ...editedPlani,
      trainingDays: updatedTrainingDays,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log('editedPlani:', editedPlani);
    
    if (queryPlaniID && plani) {
      try {
        // console.log("Enviando datos de plani:", editedPlani);
        clientLogger.debug("Updating plani with ID:", plani._id);
        clientLogger.debug("Updated plani data:", editedPlani);
        const response = await fetch(`/api/planillas?planiID=${queryPlaniID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: plani._id?.toString(), plani: editedPlani }),
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
              trainingDays: editedPlani.trainingDays,
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
            value={editedPlani.month}
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
            value={editedPlani.year}
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
            value={editedPlani.startDate ? new Date(editedPlani.startDate).toISOString().split("T")[0] : ''}
            onChange={(e) => handlePlaniChange("startDate", e.target.value)}
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
            value={editedPlani.endDate? new Date(editedPlani.endDate).toISOString().split("T")[0]:''}
            onChange={(e) => handlePlaniChange("endDate", e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-slate-900/80"
          />
        </div>
        )}
        {editedPlani.trainingDays.map((trainingDay, dayIndex) => (
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
                {trainingDay.Bloque1.length > 0 ? (
                <ExerciseForm
                  day={trainingDay.day}
                  bloque="Bloque1"
                  onChange={handleInputChange2}
                  initialExercises={trainingDay.Bloque1}
                />
                ) : (
                <ExerciseForm
                  day={trainingDay.day}
                  bloque="Bloque1"
                  onChange={handleInputChange2}
                />
                )}
              </div>
              )}
              {trainingDay.Bloque2 !== undefined && (
              <div>
                {trainingDay.Bloque2.length > 0 ? (
                <ExerciseForm
                  day={trainingDay.day}
                  bloque="Bloque2"
                  onChange={handleInputChange2}
                  initialExercises={trainingDay.Bloque2}
                />
                ) : (
                <ExerciseForm
                  day={trainingDay.day}
                  bloque="Bloque2"
                  onChange={handleInputChange2}
                />
                )}
              </div>
              )}
              {trainingDay.Bloque3 !== undefined && (
              <div>
                {trainingDay.Bloque3.length > 0 ? (
                <ExerciseForm
                  day={trainingDay.day}
                  bloque="Bloque3"
                  onChange={handleInputChange2}
                  initialExercises={trainingDay.Bloque3}
                />
                ) : (
                <ExerciseForm
                  day={trainingDay.day}
                  bloque="Bloque3"
                  onChange={handleInputChange2}
                />
                )}
              </div>
              )}
              {trainingDay.Bloque4 !== undefined && (
              <div>
                {trainingDay.Bloque4.length > 0 ? (
                <ExerciseForm
                  day={trainingDay.day}
                  bloque="Bloque4"
                  onChange={handleInputChange2}
                  initialExercises={trainingDay.Bloque4}
                />
                ) : (
                <ExerciseForm
                  day={trainingDay.day}
                  bloque="Bloque4"
                  onChange={handleInputChange2}
                />
                )}
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
          onClick={(e) => handleAddDay(e, editedPlani.trainingDays.length)}
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
