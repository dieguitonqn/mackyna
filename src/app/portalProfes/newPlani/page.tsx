"use client";

import React, { useEffect, useState } from "react";
// import { createPlan } from '@/services/api';
// import ExerciseForm from '@/components/ExerciseForm';
import AutoCompleteInput from "@/components/AutocompleteUsers";
// import { ObjectId } from "mongodb";
import TrainingDayForm from "@/components/trainingDayForm";
import { MetricCard } from "@/components/PortalAlumnos/Metricas/metricCard";
import { IUser } from "@/types/user";
import AutoCompletePlantillas from "./components/AutoCompletePlantillas";
import { IPlantilla, IPlantillaSId } from "@/types/plantilla";
import { useSession } from "next-auth/react";
import { GrTemplate } from "react-icons/gr";
import { BiSave } from "react-icons/bi";
import clientLogger from "@/lib/clientLogger";
import usePlanilla from "@/app/stores/store.plani";



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


  // ----------------------------------------------------------------------------
  // ------------WORK IN PROGESS : ZUSTAND STORE PARA PLANILLA (POR DEFINIR SI SE USA O NO)------------------
  const planilla = usePlanilla(state => state.planilla);
  const diasPlani = usePlanilla(state => state.days);
  const startDatePlani = usePlanilla(state => state.planilla.startDate);
  const endDatePlani = usePlanilla(state => state.planilla.endDate);
  
  
  const setDiasPlani = usePlanilla((state) => state.setDays);
  const setStartDatePlani = usePlanilla((state) => state.setStartDate);
  const setEndDatePlani = usePlanilla((state) => state.setEndDate);
  const setUserIdPlani = usePlanilla((state) => state.setUserId);
  const setUserEmail = usePlanilla((state) => state.setUserEmail);
  const setTrainingDays = usePlanilla((state) => state.setTrainingDays);



  // ---------------------- END SECTION ------------------------------------
  // ----------------------------------------------------------------------------

  const [users, setUsers] = useState<IUser[] | null>(null);
  const [userInfo, setUserInfo] = useState(false);

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

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

  // useEffect(() => {
  //   if (plan.startDate) {
  //     console.log("Fecha de inicio:", plan.startDate);
  //     const startDate = new Date(plan.startDate + "T00:00:00"); // Add time to ensure correct date parsing
  //     console.log("Fecha de inicio como objeto Date:", startDate);
  //     const rawMonth = startDate.toLocaleString("es-ES", { month: "long" }); // Use es-ES locale
  //     console.log("Mes en formato largo:", rawMonth);
  //     const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
  //     console.log("Mes capitalizado:", month);
  //     const year = startDate.getFullYear().toString();
  //     console.log(month, year);
  //     setPlan((prevPlan) => ({ ...prevPlan, month: month, year: year }));
  //   }
  // }, [plan.startDate]);

  // useEffect(() => {
  //   if (plan.startDate) {
  //     const startDate = new Date(plan.startDate);
  //     const rawMonth = startDate.toLocaleString("default", { month: "long" });
  //     const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
  //     const year = startDate.getFullYear().toString();
  //     console.log(month, year);
  //     setPlan((prevPlan) => ({ ...prevPlan, month: month, year: year }));
  //   }
  // }, [plan.startDate]);

  const handleSelectUser = (user: IUser) => {
    setSelectedUser(user);
    setUserInfo(true);
    // setPlan((prevPlan) => ({
    //   ...prevPlan,
    //   userId: user._id.toString(),
    //   email: user.email,
    // }));
    setUserIdPlani(user._id.toString());
    setUserEmail(user.email);
    // console.log('Usuario seleccionado:', user);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      alert("Por favor, selecciona un usuario.");
      return;
    }
    console.log("Planilla a guardar:", planilla);
    // clientLogger.info("Creando planilla para el usuario: ", { userId: selectedUser._id });
    // clientLogger.debug("Datos de la planilla: ", { plan });

    try {
      const response = await fetch("/api/planillas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...planilla }),
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
    const trainingDays = plantilla.trainingDays || [];
    setTrainingDays(trainingDays);
    setDiasPlani(trainingDays.length);
  }

  const handleModalPlantilla = () => {
    setModalPlantilla(!modalPlantilla);
  };
  const handleSavePlantilla = async (name: string, descripcion: string) => {
    const plantillaData: IPlantilla = {
      nombre: name,
      nombreUser: session?.user?.name || "Usuario Desconocido",
      descripcion: descripcion,
      trainingDays: planilla.trainingDays,
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
    <div className="mx-auto flex w-full max-w-7xl flex-col py-2">
      <header className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b9dc75]">Rutinas</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Crear nueva planilla</h1>
        <p className="mt-2 text-sm text-slate-400">Elegí al alumno, definí el período y armá los días de entrenamiento.</p>
      </header>
      <div className="mb-5">
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

      <form onSubmit={handleSubmit} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} className="w-full space-y-6">
        <section className="rounded-2xl border border-white/[0.08] bg-[#111713] p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Datos de la planilla</h2>
        <div className="mb-5 max-w-3xl">
          {users && (
            <AutoCompleteInput users={users} onSelect={handleSelectUser} />
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 text-sm text-slate-300">
            <label htmlFor="startDate">Fecha de comienzo</label>

            <input
              id="startDate"
              type="date"
              placeholder="Fecha de finalización"
              value={startDatePlani ? startDatePlani.slice(0, 10) : ""}
              onChange={(e) => setStartDatePlani(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0b0e0c] p-3 text-white outline-none transition focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
              required
            />
          </div>
          <div className="flex flex-col gap-2 text-sm text-slate-300">
            <label htmlFor="endDate">Fecha de Finalización</label>

            <input
              id="endDate"
              type="date"
              placeholder="Fecha de finalización"
              value={endDatePlani ? endDatePlani.slice(0, 10) : ""}
              onChange={(e) => setEndDatePlani(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0b0e0c] p-3 text-white outline-none transition focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
              required
            />
          </div>
          
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <label htmlFor="dias" className="font-medium">Días de entrenamiento</label>
          <input
            id="dias"
            type="number"
            value={diasPlani}
            onChange={(e) => setDiasPlani(parseInt(e.target.value))}
            className="w-24 rounded-xl border border-white/10 bg-[#0b0e0c] p-3 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
            min={1}
            max={6}
          />
        </div>
        </section>
        <div>
          <AutoCompletePlantillas plantillas={plantillas} onSelect={handlePlantillaSelect} />
        </div>
        <div className="flex flex-wrap justify-center items-start gap-4">
          <div className="flex flex-wrap justify-center items-start gap-4">
            {Array(diasPlani)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="w-full rounded-2xl border border-white/[0.08] bg-[#111713] p-4 sm:p-6">
                  <h2 className="mb-4 flex justify-center text-xl font-semibold text-white">
                    {`Día ${index + 1}`}
                  </h2>

                  <TrainingDayForm
                    day={`Día ${index + 1}`} // Pass formatted day for clarity
                    trainingDayPlanti={
                      planilla.trainingDays?.find(
                        (day) => day.day === `Día ${index + 1}`
                      ) || undefined
                    }
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#b9dc75] px-5 py-2.5 font-semibold text-[#172016] transition hover:bg-[#c9e991] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9dc75]"
          >
            <BiSave className="inline-block mr-2" /> Guardar
          </button>
          <button
            type="button"
            onClick={handleModalPlantilla}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 font-medium text-slate-200 transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9dc75]"
          >

            <GrTemplate className="inline-block mr-2" /> Guardar Como Plantilla
          </button>
        </div>
      </form>
      {modalPlantilla && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111713] p-6 shadow-2xl">
            <h2 className="mb-4 text-2xl font-semibold text-white">Guardar plantilla</h2>
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
                  className="rounded-xl border border-white/10 bg-[#0b0e0c] p-3 text-white outline-none transition focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
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
                  className="resize-none rounded-xl border border-white/10 bg-[#0b0e0c] p-3 text-white outline-none transition focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleModalPlantilla}
                  className="rounded-xl border border-white/10 px-4 py-2 text-slate-300 transition hover:bg-white/[0.06]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#b9dc75] px-4 py-2 font-semibold text-[#172016] transition hover:bg-[#c9e991]"
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
