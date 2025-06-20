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
    fetchUsers();
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
          {/* <select
            value={plan.month}
            onChange={(e) =>
              setPlan((prevPlan) => ({ ...prevPlan, month: e.target.value }))
            }
            className="border p-2 rounded-md"
            required
          >
            <option value="" disabled>
              Selecciona un mes
            </option>
            <option value="Enero">Enero</option>
            <option value="Febrero">Febrero</option>
            <option value="Marzo">Marzo</option>
            <option value="Abril">Abril</option>
            <option value="Mayo">Mayo</option>
            <option value="Junio">Junio</option>
            <option value="Julio">Julio</option>
            <option value="Agosto">Agosto</option>
            <option value="Septiembre">Septiembre</option>
            <option value="Octubre">Octubre</option>
            <option value="Noviembre">Noviembre</option>
            <option value="Diciembre">Diciembre</option>
          </select>
          <select
            value={plan.year}
            onChange={(e) =>
              setPlan((prevPlan) => ({ ...prevPlan, year: e.target.value }))
            }
            className="border p-2 rounded-md"
            required
          >
            <option value="" disabled>
              Selecciona el año
            </option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="2030">2030</option>
          </select> */}
        </div>
        <div className="flex justify-center items-center gap-5">
          <div className="flex flex-col text-slate-300">
            <label htmlFor="startDate" >Fecha de comienzo</label>

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
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPlan;
