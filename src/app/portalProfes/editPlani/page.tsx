"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Exercise, Plani } from "@/types/plani";

import ExerciseForm from "@/components/ExerciseForm";
import { IUser } from "@/types/user";


const EditPlani = () => {
  const searchParams = useSearchParams();
  const queryPlaniID = searchParams.get("planiID");
  const [plani, setPlani] = useState<Plani>();
  const [user, setUser] = useState<IUser>();

  const [editedPlani, setEditedPlani] = useState<Plani>({
    month: "",
    year: "",
    userId: "",
    email: "",
    trainingDays: [],
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (queryPlaniID) {
      fetch(`/api/planillas?planiID=${queryPlaniID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error fetching plani");
          }
          return response.json();
        })
        .then((data) => {
          setPlani(data);
          setEditedPlani(JSON.parse(JSON.stringify(data))); // Crear una copia profunda de data
        })
        .catch((error) => console.error("Error fetching plani:", error));



      
    }
  }, []);


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
  }
  , [plani]);



  if (!plani) {
    return <div>Cargando...</div>;
  }

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
    try {
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
    // try {
    //     const response = await axios.put(`/api/planillas?planiID=${queryPlaniID}`, editedPlani);
    //     console.log('response:', response);
    //     alert('Planilla actualizada correctamente');
    // } catch (error) {
    //     console.error('Error al actualizar planilla:', error);
    //     alert('Error al actualizar planilla');
    // }
  };
  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">
          Editar planilla de {user?.nombre} {user?.apellido}
        </h1>
        {/* Aquí puedes agregar un formulario para editar la planilla */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Mes
          </label>
          <input
            type="text"
            value={editedPlani.month}
            onChange={(e) => handlePlaniChange("month", e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Año
          </label>
          <input
            type="text"
            value={editedPlani.year}
            onChange={(e) => handlePlaniChange("year", e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {/* <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>ID de Usuario</label>
                    <input type="text" value={editedPlani.userId} onChange={(e) => handlePlaniChange('userId', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
                    <input type="text" value={editedPlani.email} onChange={(e) => handlePlaniChange('email', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                </div> */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={new Date(editedPlani.startDate).toISOString().split("T")[0]}
            onChange={(e) => handlePlaniChange("startDate", e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fecha de Fin
          </label>
          <input
            type="date"
            value={new Date(editedPlani.endDate).toISOString().split("T")[0]}
            onChange={(e) => handlePlaniChange("endDate", e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {editedPlani.trainingDays.map((trainingDay, dayIndex) => (
          <div
            className="flex flex-col items-center  bg-slate-200 my-5 p-2"
            key={dayIndex}
          >
            <h2 className="text-2xl font-bold mb-2">{trainingDay.day}</h2>
            <div
              key={dayIndex * 10}
              className="my-6 flex flex-wrap gap-10 items-center"
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
        <button className="flex m-auto bg-green-600/60 px-2 py-1 rounded-md">
          Guardar
        </button>
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
