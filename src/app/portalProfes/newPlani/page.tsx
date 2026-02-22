"use client";

import React, { useEffect } from "react";
import { IPlantilla } from "@/types/plantilla";
import AutoCompleteInput from "@/components/AutocompleteUsers";
import TrainingDayForm from "@/components/trainingDayForm";
import { MetricCard } from "@/components/PortalAlumnos/Metricas/metricCard";
import { IUser } from "@/types/user";
import AutoCompletePlantillas from "./components/AutoCompletePlantillas";
import { useSession } from "next-auth/react";
import { GrTemplate } from "react-icons/gr";
import { BiSave } from "react-icons/bi";
import { useNewPlaniStore } from "@/stores/useNewPlaniStore";


const NewPlan: React.FC = () => {
  const users = useNewPlaniStore((state) => state.users);
  const userInfo = useNewPlaniStore((state) => state.userInfo);
  const selectedUser = useNewPlaniStore((state) => state.selectedUser);
  const days = useNewPlaniStore((state) => state.days);
  const plan = useNewPlaniStore((state) => state.plan);
  const plantillas = useNewPlaniStore((state) => state.plantillas);
  const modalPlantilla = useNewPlaniStore((state) => state.modalPlantilla);
  const modalPlantillaForm = useNewPlaniStore((state) => state.modalPlantillaForm);
  const setDays = useNewPlaniStore((state) => state.setDays);
  const setDateField = useNewPlaniStore((state) => state.setDateField);
  const syncMonthYearFromStartDate = useNewPlaniStore((state) => state.syncMonthYearFromStartDate);
  const fetchUsers = useNewPlaniStore((state) => state.fetchUsers);
  const fetchPlantillas = useNewPlaniStore((state) => state.fetchPlantillas);
  const selectUser = useNewPlaniStore((state) => state.selectUser);
  const loadPlantilla = useNewPlaniStore((state) => state.loadPlantilla);
  const submitPlanilla = useNewPlaniStore((state) => state.submitPlanilla);
  const saveCurrentAsPlantilla = useNewPlaniStore((state) => state.saveCurrentAsPlantilla);
  const openModalPlantilla = useNewPlaniStore((state) => state.openModalPlantilla);
  const closeModalPlantilla = useNewPlaniStore((state) => state.closeModalPlantilla);
  const setModalPlantillaField = useNewPlaniStore((state) => state.setModalPlantillaField);

  useEffect(() => {
    fetchPlantillas();
    fetchUsers();
  }, [fetchUsers, fetchPlantillas]);

  useEffect(() => {
    syncMonthYearFromStartDate();
  }, [plan.startDate, syncMonthYearFromStartDate]);

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const newDays = Math.min(5, Math.max(1, parseInt(e.target.value) || 1)); // Límite entre 1 y 5
    const newDays = parseInt(e.target.value);
    setDays(newDays);
  };

  const handleSelectUser = (user: IUser) => {
    selectUser(user);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitPlanilla();

    if (result.ok) {
      alert("Planilla creada exitosamente");
      return;
    }

    alert(result.error || "Error al crear la planilla");
  };
  const {data:session} = useSession();

  const handlePlantillaSelect = (plantilla: IPlantilla) => {
    console.log("Plantilla seleccionada:", plantilla);
    loadPlantilla(plantilla);
    console.log(plan);
  }

  const handleSavePlantilla = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await saveCurrentAsPlantilla(session?.user?.name || "Usuario Desconocido");

    if (result.ok) {
      alert("Plantilla guardada exitosamente");
      return;
    }

    alert(result.error || "Error al guardar la plantilla");
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
                setDateField("startDate", e.target.value)
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
                setDateField("endDate", e.target.value)
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
            onClick={openModalPlantilla}
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
              onSubmit={handleSavePlantilla}
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
                value={modalPlantillaForm.name}
                onChange={(e) => setModalPlantillaField("name", e.target.value)}
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
                value={modalPlantillaForm.descripcion}
                onChange={(e) => setModalPlantillaField("descripcion", e.target.value)}
                placeholder="Describe el objetivo y características de esta plantilla..."
                className="border rounded-md p-2 bg-slate-800 text-slate-200 border-slate-700 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition duration-200 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                type="button"
                onClick={closeModalPlantilla}
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
