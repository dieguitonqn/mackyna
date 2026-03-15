import React, { useEffect, useState } from "react";
import { Exercise } from "@/types/plani";
import AutoCompleteInputEj from "./AutoCompleteEjercicio";
import usePlanilla from "@/app/stores/store.plani";

interface Props {
  day: string;

  bloque: string;
  initialExercises?: Exercise[];
}

type Ejercicio = {
  _id: string;
  nombre: string;
  grupoMusc: string;
  specificMusc: string;
  description: string;
  video: string;
};
const ExerciseForm: React.FC<Props> = ({
  day,
  bloque,
  initialExercises,
}) => {
  const setExercisesForBlock = usePlanilla((state) => state.setExercisesForBlock);

  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]); // Estado de usuarios
  const [exercises, setExercises] = useState<Exercise[]>([
    ...(initialExercises || [
      {
        name: "",
        reps: "",
        sets: 1,
        notas: "",
        videoLink: "",
      },
    ]),
  ]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const gruposMusculares = Array.from(
    new Set(ejercicios.map((ejercicio) => ejercicio.grupoMusc).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

  useEffect(() => {
    setSelectedGroups((prev) => {
      if (prev.length === exercises.length) return prev;
      const next = Array(exercises.length).fill("");
      for (let i = 0; i < exercises.length; i++) {
        next[i] = prev[i] || "";
      }
      return next;
    });
  }, [exercises.length]);

  useEffect(() => {
    if (initialExercises) {
      setExercises(initialExercises);
    }
  }
  , [initialExercises]);

  
  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await fetch("/api/ejercicios");
        const ejerciciosDB = await response.json();
        const ejerciciosWithStringId = ejerciciosDB.map(
          (ejercicio: Ejercicio) => ({
            ...ejercicio,
            id: ejercicio._id.toString(), // Convertir ObjectId a string
          })
        );

        setEjercicios(ejerciciosWithStringId);
        // console.log(ejerciciosWithStringId);
      } catch (err) {
        console.error("Error al obtener ejercicios:", err);
      }
    };
    fetchEjercicios();
  }, [exercises]);

  const handleAddExercise = () => {
    const newExercise: Exercise = {
      name: "",
      reps: "", // Permitir string vacío inicial
      sets: 1, // valor por defecto
      notas: "",
      videoLink: "",
    };
    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);
    setExercisesForBlock(day, bloque, updatedExercises);
  };

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
    setExercisesForBlock(day, bloque, updatedExercises);
  };

  const handleInputChange = (
    index: number,
    field: keyof Exercise,
    value: string | number
  ) => {
    
    const updatedExercises = [...exercises];

    // Validaciones específicas por campo
    if (field === "sets" && typeof value === "number" && value <= 1) {
      value = 1; // Mínimo 1 serie
    }

    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
    setExercisesForBlock(day, bloque, updatedExercises);
  };

  const handleSelectEjercicio = (index: number, ejercicio: Ejercicio) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      name: ejercicio.nombre,
      videoLink: ejercicio.video,
    };
    setExercises(updatedExercises);
    setExercisesForBlock(day, bloque, updatedExercises);
  };

  const handleGroupChange = (index: number, group: string) => {
    setSelectedGroups((prev) => {
      const updated = [...prev];
      updated[index] = group;
      return updated;
    });

    if (!group) return;

    const ejerciciosDelGrupo = ejercicios.filter(
      (ejercicio) => ejercicio.grupoMusc === group
    );

    if (ejerciciosDelGrupo.length === 0) return;

    const randomIndex = Math.floor(Math.random() * ejerciciosDelGrupo.length);
    const randomExercise = ejerciciosDelGrupo[randomIndex];

    if (!exercises[index]) return;

    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      name: randomExercise.nombre,
      videoLink: randomExercise.video,
    };

    setExercises(updatedExercises);
    setExercisesForBlock(day, bloque, updatedExercises);
  };

  return (
    <div className="flex flex-col justify-center text-center border-2 border-slate-700 p-2 m-1 shadow-lg rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700/80">
      <h2 className="shadow py-2 px-4 my-4 border border-slate-600 text-2xl font-bold text-slate-100 bg-slate-800/80 rounded-lg">
        {bloque.replace(/bloque(\d)/i, "Bloque $1")}
      </h2>
      {exercises.map((exercise, index) => {
        const groupSelected = selectedGroups[index] || "";
        const ejerciciosFiltrados = groupSelected
          ? ejercicios.filter((ejercicio) => ejercicio.grupoMusc === groupSelected)
          : ejercicios;

        return (
        <div
          key={`exercise-${index}`}
          className="flex flex-col gap-2 border border-slate-600 shadow-md shadow-slate-900 p-2 mb-6 rounded-lg bg-slate-800/80 transition-colors duration-200 hover:border-blue-400 text-left"
        >
          <label htmlFor={`grupo-${index}`} className="block mb-1 text-slate-200 font-semibold">
            Grupo muscular
          </label>
          <select
            id={`grupo-${index}`}
            value={groupSelected}
            onChange={(e) => handleGroupChange(index, e.target.value)}
            className="mb-2 shadow-sm p-2 border border-slate-600 bg-slate-900 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
          >
            <option value="">Todos los grupos</option>
            {gruposMusculares.map((grupo) => (
              <option key={`${index}-${grupo}`} value={grupo}>
                {grupo}
              </option>
            ))}
          </select>
          <label htmlFor={`name-${index}`} className="block mb-1 text-slate-200 font-semibold">
            Nombre del ejercicio
          </label>
          <AutoCompleteInputEj
            ejercicios={ejerciciosFiltrados}
            onSelect={(ejercicio) => handleSelectEjercicio(index, ejercicio)}
            initialValue={exercise.name as string}
          />
          <label htmlFor={`reps-${index}`} className="block mb-1 text-slate-300 font-semibold">
            Repeticiones
          </label>
          <input
            id={`reps-${index}`}
            type="text"
            value={exercise.reps}
            onChange={(e) => handleInputChange(index, "reps", e.target.value)}
            className="mb-2 shadow-sm p-2 border border-slate-600 bg-slate-900 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
          />
          <label htmlFor={`sets-${index}`} className="block mb-1 text-slate-300 font-semibold">
            Series
          </label>
          <input
            id={`sets-${index}`}
            type="number"
            value={exercise.sets}
            onChange={(e) => handleInputChange(index, "sets", parseInt(e.target.value))}
            className="mb-2 shadow-sm p-2 border border-slate-600 bg-slate-900 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
            min={1}
          />
          <label htmlFor={`videoLink-${index}`} className="block mb-1 text-slate-300 font-semibold">
            Enlace al video
          </label>
          <input
            id={`videoLink-${index}`}
            type="text"
            placeholder="Enlace al video"
            value={exercise.videoLink || ""}
            onChange={(e) => handleInputChange(index, "videoLink", e.target.value)}
            className="mb-2 shadow-sm p-2 border border-slate-600 bg-slate-900 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
          />
          <div className="flex justify-center mt-2">
            <button
              type="button"
              onClick={() => handleRemoveExercise(index)}
              className="bg-red-500/80 hover:bg-red-600 text-white font-semibold rounded-md border border-slate-700 shadow w-1/2 py-1 transition-all duration-150"
            >
              Borrar Ejercicio
            </button>
          </div>
        </div>
      )})}
      <button
        type="button"
        onClick={handleAddExercise}
        className="bg-green-500/80 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md border border-slate-700 shadow transition-all duration-150 mt-2"
      >
        + Agregar Ejercicio
      </button>
    </div>
  );
};

export default ExerciseForm;
