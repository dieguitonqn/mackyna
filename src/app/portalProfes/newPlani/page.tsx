"use client";

import React, { useEffect, useState } from "react";
// import { createPlan } from '@/services/api';
import { Plani, TrainingDay } from "@/types/plani";
import Plantilla from "@/lib/models/plantilla";
// import ExerciseForm from '@/components/ExerciseForm';
import AutoCompleteInput from "@/components/AutocompleteUsers";
// import { ObjectId } from "mongodb";
import TrainingDayForm from "@/components/trainingDayForm";
import { MetricCard } from "@/components/PortalAlumnos/Metricas/metricCard";
import { IUser } from "@/types/user";
import { set } from "mongoose";
import { IPlantilla } from "@/types/plantilla";
import AutoCompletePlantillas from "./components/AutoCompletePlantillas";

// interface IUser {
//   _id: ObjectId | string;
//   nombre: string;
//   apellido: string;
//   email: string;
//   pwd: string;
//   rol: string;
//   altura?: number;
//   fecha_nacimiento?: Date;
//   objetivo?: string;
//   lesiones?: string;
// }

const NewPlan: React.FC = () => {
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [userInfo, setUserInfo] = useState(false);
  const [plantillaModal, setPlantillaModal] = useState(false);
  const [plantillas, setPlantillas] = useState<IPlantilla[] | null>(null);
  const [plantillaName, setPlantillaName] = useState("");
  const [plantillaDescription, setPlantillaDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [days, setDays] = useState<number>(1); // Cantidad de días seleccionados
  const [plan, setPlan] = useState<Plani>({
    month: "",
    year: "",
    userId: "",
    email: "",
    trainingDays: [],
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/usuarios");
        const usersDB = await response.json();
        const usersWithStringId = usersDB.map((user: IUser) => ({
          ...user,
          id: user._id.toString(),
        }));

        setUsers(usersWithStringId);
      } catch (err:unknown) {
        console.error("Error al obtener usuarios:", err);
      }
    };

    const fetchPlantillas = async () => {
      console.log("Fetching plantillas...");
      try {
        const response = await fetch("/portalProfes/Plantillas/api/plantillas");
        const plantillasDB = await response.json();
        // const plantillasWithStringId = plantillasDB.map(
        //   (plantilla: IPlantilla) => ({
        //     ...plantilla,
        //     _id: plantilla._id?.toString(),
        //   })
        // );
        setPlantillas(plantillasDB);

        console.log("Plantillas obtenidas:", plantillasDB);
      } catch (err:unknown) {
        console.error("Error al obtener plantillas:", err);
      }
    };

    fetchUsers();
    fetchPlantillas();
  }, []);


  useEffect(() => {
    if (plan.startDate) {
      const startDate = new Date(plan.startDate);
      const rawMonth = startDate.toLocaleString("default", { month: "long" });
      const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
      const year = startDate.getFullYear().toString();
      console.log(month, year);
      setPlan((prevPlan) => ({ ...prevPlan, month: month, year: year }));
    }
  }, [plan.startDate]);

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const newDays = Math.min(5, Math.max(1, parseInt(e.target.value) || 1)); // Límite entre 1 y 5
    const newDays = parseInt(e.target.value);
    setDays(newDays);
  };

  // const handleExerciseChange = (bloque: string, exercises: Exercise[]) => {
  //   setPlan((prevPlan) => ({ ...prevPlan, [bloque]: exercises }));
  // };

  const handleTrainingDayChange = (day: string, trainingDay: TrainingDay) => {
    if (day === "") {
      // Handle the empty day scenario (optional)
      console.warn(
        "Received empty day value for training change. Ignoring update."
      );
      return; // Early exit if day is empty
    }

    // console.log(trainingDay);
    setPlan((prevPlan) => {
      const existingIndex = prevPlan.trainingDays.findIndex(
        (d) => d.day === day
      );

      let updatedTrainingDays;
      if (existingIndex !== -1) {
        // Update existing day
        updatedTrainingDays = [...prevPlan.trainingDays];
        updatedTrainingDays[existingIndex] = trainingDay;
      } else {
        // Add new day
        updatedTrainingDays = [...prevPlan.trainingDays, trainingDay];
      }

      // console.log(updatedTrainingDays);
      return {
        ...prevPlan,
        trainingDays: updatedTrainingDays,
      };
    });
  };

  const handleSelectUser = (user: IUser) => {
    setSelectedUser(user);
    setUserInfo(true);
    setPlan((prevPlan) => ({
      ...prevPlan,
      userId: user._id.toString(),
      email: user.email,
    }));
    // console.log('Usuario seleccionado:', user);
  };

  const handleSelectPlantilla = (plantilla: IPlantilla) => {
    // Primero reseteamos los training days actuales
    setPlan(prevPlan => ({
      ...prevPlan,
      trainingDays: []
    }));

    // Luego actualizamos los días para forzar el re-render de los componentes
    setDays(0);
    
    // Después de un pequeño delay, actualizamos con los nuevos datos
    setTimeout(() => {
      // Hacemos una copia profunda de los training days
      const newTrainingDays = plantilla.trainingDays.map((day, index) => ({
        ...day,
        day: `Día ${index + 1}`, // Aseguramos que el día tenga el formato correcto
        Bloque1: day.Bloque1 ? [...day.Bloque1] : [],
        Bloque2: day.Bloque2 ? [...day.Bloque2] : [],
        Bloque3: day.Bloque3 ? [...day.Bloque3] : [],
        Bloque4: day.Bloque4 ? [...day.Bloque4] : []
      }));

      // Actualizamos el plan con los nuevos días
      setPlan(prevPlan => ({
        ...prevPlan,
        trainingDays: newTrainingDays,
      }));

      // Finalmente actualizamos la cantidad de días
      setDays(plantilla.trainingDays.length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      alert("Por favor, selecciona un usuario.");
      return;
    }
    console.log("El plan es: ");
    console.log(plan);
    try {
      const response = await fetch("/api/planillas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...plan }),
      });

      if (!response.ok) throw new Error("Error al crear la planilla");
      alert("Planilla creada exitosamente");
    } catch (error) {
      console.error(error);
      alert("Error al crear la planilla");
    }
  };

  const handleSavePlantilla = async () => {
    try {
      const response = await fetch("/api/plantillas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: plantillaName,
          descripcion: plantillaDescription,
          trainingDays: plan.trainingDays,
        }),
      });

      if (!response.ok) throw new Error("Error al guardar la plantilla");
      alert("Plantilla guardada exitosamente");
      setPlantillaModal(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar la plantilla");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h1 className="text-4xl my-5">Crear Nueva Planilla</h1>
      <div className=" mb-3">
        {userInfo && selectedUser && (
          <MetricCard
            userID={selectedUser._id.toString()}
            birthDate={
              selectedUser.fecha_nacimiento
                ? new Date(selectedUser.fecha_nacimiento)
                : null
            }
            altura={selectedUser.altura}
            objetivo={selectedUser.objetivo}
            lesiones={selectedUser.lesiones}
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-wrap justify-center items-center gap-2 mb-5 max-w-3xl m-auto">
          {users && (
            <AutoCompleteInput users={users} onSelect={handleSelectUser} />
          )}
        </div>
        <div className="flex justify-center items-center gap-5">
          <div className="flex flex-col text-slate-300">
            <label htmlFor="startDate">Fecha de comienzo</label>

            <input
              id="startDate"
              type="date"
              placeholder="Fecha de finalización"
              value={plan.startDate}
              onChange={(e) =>
                setPlan((prevPlan) => ({
                  ...prevPlan,
                  startDate: e.target.value,
                }))
              }
              className="border p-2 rounded-md bg-slate-900/80"
              required
            />
          </div>
          <div className="flex flex-col text-slate-300">
            <label htmlFor="endDate">Fecha de Finalización</label>

            <input
              id="endDate"
              type="date"
              placeholder="Fecha de finalización"
              value={plan.endDate}
              onChange={(e) =>
                setPlan((prevPlan) => ({
                  ...prevPlan,
                  endDate: e.target.value,
                }))
              }
              className="border p-2 rounded-md  bg-slate-900/80"
              required
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-5 my-10 text-slate-300">
          <label htmlFor="dias">Días de entrenamiento</label>
          <input
            id="dias"
            type="number"
            value={days}
            onChange={handleDaysChange}
            className="border p-2 rounded-md  bg-slate-900/80"
            min={1}
            max={5}
          />
        </div>
        <div>
          <div className="flex justify-center items-center mb-5">
            {plantillas && (
              <AutoCompletePlantillas
                plantillas={plantillas}
                onSelect={handleSelectPlantilla}
              />
            )}
          </div>
        </div>
        <div>
          <div className="flex flex-wrap justify-center items-start gap-4">
            {Array(days)
              .fill(null)
              .map((_, index) => {
                const currentDay = `Día ${index + 1}`;
                const existingTrainingDay = plan.trainingDays.find(
                  (day) => day.day === currentDay
                );
                
                return (
                  <div key={`${currentDay}-${plan.trainingDays.length}`} className="w-full">
                    <h2 className="text-xl mb-2 flex justify-center">
                      {currentDay}
                    </h2>

                    <TrainingDayForm
                      key={`form-${currentDay}-${JSON.stringify(existingTrainingDay)}`}
                      day={currentDay}
                      onChange={handleTrainingDayChange}
                      initialTrainingDay={existingTrainingDay}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <button
            type="submit"
            className="bg-emerald-500/50 py-2 px-4 rounded-md shadow-md shadow-gray-300 hover:bg-emerald-500 hover:text-white transition-colors"
          >
            Guardar
          </button>
        </div>
        <div className="flex justify-center mt-5">
          <button
            className="bg-black/70 py-2 px-4 text-slate-300 rounded-md shadow-md shadow-gray-300 hover:bg-emerald-500 hover:text-white transition-colors"
            onClick={() => setPlantillaModal(true)}
          >
            Guardar Plantilla
          </button>
        </div>
      </form>
      {plantillaModal && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="bg-slate-800/95 p-8 rounded-xl shadow-2xl backdrop-blur-sm w-96 border border-slate-700">
            <h2 className="text-2xl mb-6 text-slate-200 font-bold tracking-tight">
              Guardar Plantilla
            </h2>

            <div className="space-y-6">
              <div className="relative">
                <label className="block mb-2 text-sm font-medium text-slate-300">
                  Nombre de la Plantilla
                </label>
                <input
                  type="text"
                  value={plantillaName}
                  onChange={(e) => setPlantillaName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-lg 
                  text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 
                  focus:border-transparent transition-all duration-200"
                  placeholder="Ej: Rutina de fuerza"
                  required
                />
              </div>

              <div className="relative">
                <label className="block mb-2 text-sm font-medium text-slate-300">
                  Descripción
                </label>
                <textarea
                  value={plantillaDescription}
                  onChange={(e) => setPlantillaDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-lg 
                  text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 
                  focus:border-transparent transition-all duration-200 min-h-[100px] resize-none"
                  placeholder="Describe los detalles de la plantilla..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setPlantillaModal(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 
                  bg-slate-700/50 hover:bg-slate-700 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePlantilla}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-white
                  bg-emerald-600 hover:bg-emerald-500 transition-all duration-200
                  shadow-lg shadow-emerald-500/20"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPlan;
