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
  const [selectedSpecificMuscs, setSelectedSpecificMuscs] = useState<string[]>([]);

  const muscEspecificos = Array.from(
    new Set(ejercicios.map((ejercicio) => ejercicio.specificMusc).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

  useEffect(() => {
    setSelectedSpecificMuscs((prev) => {
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

  const handleSpecificMuscChange = (index: number, specificMusc: string) => {
    setSelectedSpecificMuscs((prev) => {
      const updated = [...prev];
      updated[index] = specificMusc;
      return updated;
    });

    if (!specificMusc) return;

    const ejerciciosDelMusculo = ejercicios.filter(
      (ejercicio) => ejercicio.specificMusc === specificMusc
    );

    if (ejerciciosDelMusculo.length === 0) return;

    const randomIndex = Math.floor(Math.random() * ejerciciosDelMusculo.length);
    const randomExercise = ejerciciosDelMusculo[randomIndex];

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
    <div className="flex h-full flex-col justify-center rounded-2xl border border-white/[0.08] bg-[#0d120f] p-3 text-center shadow-lg">
      <h2 className="my-3 rounded-xl border border-white/[0.08] bg-[#111713] px-4 py-3 text-lg font-semibold text-white">
        {bloque.replace(/bloque(\d)/i, "Bloque $1")}
      </h2>
      {exercises.map((exercise, index) => {
        const specificMuscSelected = selectedSpecificMuscs[index] || "";
        const ejerciciosFiltrados = specificMuscSelected
          ? ejercicios.filter((ejercicio) => ejercicio.specificMusc === specificMuscSelected)
          : ejercicios;

        return (
        <div
          key={`exercise-${index}`}
          className="mb-4 flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-[#111713] p-3 text-left transition-colors duration-200 hover:border-[#b9dc75]/30"
        >
          <label htmlFor={`specificMusc-${index}`} className="block mb-1 text-slate-200 font-semibold">
            Músculo específico
          </label>
          <select
            id={`specificMusc-${index}`}
            value={specificMuscSelected}
            onChange={(e) => handleSpecificMuscChange(index, e.target.value)}
            className="mb-2 rounded-lg border border-white/10 bg-[#0b0e0c] p-2.5 text-slate-100 outline-none transition focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
          >
            <option value="">Todos los músculos</option>
            {muscEspecificos.map((musculo) => (
              <option key={`${index}-${musculo}`} value={musculo}>
                {musculo}
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
            className="mb-2 rounded-lg border border-white/10 bg-[#0b0e0c] p-2.5 text-slate-100 outline-none transition focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
          />
          <label htmlFor={`sets-${index}`} className="block mb-1 text-slate-300 font-semibold">
            Series
          </label>
          <input
            id={`sets-${index}`}
            type="number"
            value={exercise.sets}
            onChange={(e) => handleInputChange(index, "sets", parseInt(e.target.value))}
            className="mb-2 rounded-lg border border-white/10 bg-[#0b0e0c] p-2.5 text-slate-100 outline-none transition focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
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
            className="mb-2 rounded-lg border border-white/10 bg-[#0b0e0c] p-2.5 text-slate-100 outline-none transition focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
          />
          <div className="flex justify-center mt-2">
            <button
              type="button"
              onClick={() => handleRemoveExercise(index)}
              className="min-h-10 w-full rounded-lg border border-rose-300/15 bg-rose-400/[0.08] py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-400/[0.16] sm:w-1/2"
            >
              Borrar Ejercicio
            </button>
          </div>
        </div>
      )})}
      <button
        type="button"
        onClick={handleAddExercise}
        className="mt-2 min-h-11 rounded-xl bg-[#b9dc75] px-4 py-2 font-semibold text-[#172016] transition hover:bg-[#c9e991]"
      >
        + Agregar Ejercicio
      </button>
    </div>
  );
};

export default ExerciseForm;
