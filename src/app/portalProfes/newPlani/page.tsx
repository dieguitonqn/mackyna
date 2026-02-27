"use client";

import React, { useEffect, useState } from "react";
// import { createPlan } from '@/services/api';
import { Plani, TrainingDay } from "@/types/plani";
// import ExerciseForm from '@/components/ExerciseForm';
import AutoCompleteInput from "@/components/AutocompleteUsers";
// import { ObjectId } from "mongodb";
import TrainingDayForm from "@/components/trainingDayForm";
import { MetricCard } from "@/components/PortalAlumnos/Metricas/metricCard";
import { IUser } from "@/types/user";
import AutoCompletePlantillas from "./components/AutoCompletePlantillas";
import { IPlantilla, IPlantillaSId } from "@/types/plantilla";
import { set } from "mongoose";
import { useSession } from "next-auth/react";
import { GrTemplate } from "react-icons/gr";
import { BiSave } from "react-icons/bi";
import clientLogger from "@/lib/clientLogger";
import logger from "@/lib/logger";


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
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
      }
    };
    const fetchPlantillas = async () => {
      try {
        const response = await fetch("/portalProfes/Plantillas/api/plantillas");
        const plantillasDB = await response.json();
        const plantillasWithStringId = plantillasDB.map((plantilla: IPlantillaSId) => ({
          ...plantilla,
          id: plantilla._id?.toString(),
        }));
        setPlantillas(plantillasWithStringId);
        // console.log("Plantillas obtenidas:", plantillasWithStringId);
        // Aquí puedes guardar las plantillas en el estado si es necesario
      } catch (err) {
        console.error("Error al obtener plantillas:", err);
      }
    };
    fetchPlantillas();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (plan.startDate) {
      console.log("Fecha de inicio:", plan.startDate);
      const startDate = new Date(plan.startDate + "T00:00:00"); // Add time to ensure correct date parsing
      console.log("Fecha de inicio como objeto Date:", startDate);
      const rawMonth = startDate.toLocaleString("es-ES", { month: "long" }); // Use es-ES locale
      console.log("Mes en formato largo:", rawMonth);
      const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
      console.log("Mes capitalizado:", month);
      const year = startDate.getFullYear().toString();
      console.log(month, year);
      setPlan((prevPlan) => ({ ...prevPlan, month: month, year: year }));
    }
  }, [plan.startDate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      alert("Por favor, selecciona un usuario.");
      return;
    }
    clientLogger.info("Creando planilla para el usuario: ", { userId: selectedUser._id });
    clientLogger.debug("Datos de la planilla: ", { plan });

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
      clientLogger.error("Error al crear la planilla", { error, userId: selectedUser._id });
      alert("Error al crear la planilla");
    }
  };
  // ------------ CODIGO DE PLANTILLAS ----------------
  const [plantillas, setPlantillas] = useState<IPlantilla[]>([]);
  const [modalPlantilla, setModalPlantilla] = useState(false);
  const { data: session } = useSession();

  const handlePlantillaSelect = (plantilla: IPlantilla) => {
    console.log("Plantilla seleccionada:", plantilla);
    setDays(0); // Resetea los días antes de aplicar la plantilla
    setPlan(prevPlan => ({ ...prevPlan, trainingDays: [] }));
    setTimeout(() => {
      setPlan(plan => ({
        ...plan,
        trainingDays: plantilla.trainingDays || [],
      }));

      setDays(plantilla.trainingDays.length); // Actualiza los días según la plantilla seleccionada
    }, 0);

    console.log(plan);
  }

  const handleModalPlantilla = () => {
    setModalPlantilla(!modalPlantilla);
  };
  const handleSavePlantilla = async (name: string, descripcion: string) => {
    const plantillaData: IPlantilla = {
      nombre: name,
      nombreUser: session?.user?.name || "Usuario Desconocido",
      descripcion: descripcion,
      trainingDays: plan.trainingDays,
    };
    clientLogger.info("Guardando nueva plantilla: ", { plantillaData });
    try {
      const response = await fetch("/portalProfes/Plantillas/api/plantillas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plantillaData),
      });

      if (!response.ok) throw new Error("Error al guardar la plantilla");

      const savedPlantilla = await response.json();
      console.log("Plantilla guardada:", savedPlantilla);
      alert("Plantilla guardada exitosamente");
      setModalPlantilla(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar la plantilla");
    }
  };
  // -------------------------------------------------
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

      <form onSubmit={handleSubmit} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} className="w-full">
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
          <AutoCompletePlantillas plantillas={plantillas} onSelect={handlePlantillaSelect} />
        </div>
        <div className="flex flex-wrap justify-center items-start gap-4">
          <div className="flex flex-wrap justify-center items-start gap-4">
            {Array(days)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="w-full">
                  <h2 className="text-xl mb-2 flex justify-center">
                    {`Día ${index + 1}`}
                  </h2>

                  <TrainingDayForm
                    day={`Día ${index + 1}`} // Pass formatted day for clarity
                    onChange={handleTrainingDayChange}
                    trainingDayPlanti={
                      plan.trainingDays.find(
                        (day) => day.day === `Día ${index + 1}`
                      ) || undefined
                    }
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <button
            type="submit"
            className="bg-emerald-500/50 py-2 px-4 rounded-md shadow-md shadow-gray-300 hover:bg-emerald-500 hover:text-white transition-colors"
          >
            <BiSave className="inline-block mr-2" /> Guardar
          </button>
        </div>
        <div className="flex justify-center mt-5">
          <button
            type="button"
            onClick={handleModalPlantilla}
            className="bg-gray-800/50 text-gray-300 py-2 px-4 rounded-md shadow-md shadow-gray-300 hover:bg-gray-700 hover:text-white hover:font-semibold transition-colors ml-5"
          >

            <GrTemplate className="inline-block mr-2" /> Guardar Como Plantilla
          </button>
        </div>
      </form>
      {modalPlantilla && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-lg shadow-xl max-w-md w-full border border-slate-500">
            <h2 className="text-2xl font-semibold mb-4 text-slate-300">Guardar Plantilla</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const name = (e.target as any).name.value;
                const descripcion = (e.target as any).descripcion.value;
                handleSavePlantilla(name, descripcion);
              }}
              className="space-y-4"
            >
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 font-medium text-slate-300">
                  Nombre de la Plantilla:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Ej: Rutina Full Body"
                  className="border rounded-md p-2 bg-slate-800 text-slate-200 border-slate-700 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition duration-200"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="descripcion" className="mb-1 font-medium text-slate-300">
                  Descripción:
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows={4}
                  placeholder="Describe el objetivo y características de esta plantilla..."
                  className="border rounded-md p-2 bg-slate-800 text-slate-200 border-slate-700 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition duration-200 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleModalPlantilla}
                  className="px-4 py-2 bg-red-500/50 text-white rounded-md hover:bg-red-600 transition duration-200 shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500/50 text-white rounded-md hover:bg-emerald-600 transition duration-200 shadow-sm"
                >
                  Guardar Plantilla
                </button>
              </div>
            </form>
          </div>
        </div>

      )}
    </div>
  );
};

export default NewPlan;
