import React, { useEffect, useState } from "react";
import { Exercise } from "@/types/plani";
import AutoCompleteInputEj from "./AutoCompleteEjercicio";

interface Props {
  day: string;

  bloque: string;
  onChange: (day: string, bloque: string, exercises: Exercise[]) => void;
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
  onChange,
  initialExercises,
}) => {
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
    onChange(day, bloque, updatedExercises);
  };

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
    onChange(day, bloque, updatedExercises);
  };

  const handleInputChange = (
    index: number,
    field: keyof Exercise,
    value: string | number
  ) => {
    
    const updatedExercises = [...exercises];

    // Validaciones específicas por campo
    if (field === "sets" && typeof value === "number" && value < 1) {
      value = 1; // Mínimo 1 serie
    }

    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
    onChange(day, bloque, updatedExercises);
  };

  const handleSelectEjercicio = (index: number, ejercicio: Ejercicio) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      name: ejercicio.nombre,
      videoLink: ejercicio.video,
    };
    setExercises(updatedExercises);
    onChange(day, bloque, updatedExercises);
  };

  return (
    <div className="flex flex-col justify-center text-center border-2 border-slate-700 p-5 m-5 shadow-lg rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700/80">
      <h2 className="shadow py-2 px-4 my-4 border border-slate-600 text-2xl font-bold text-slate-100 bg-slate-800/80 rounded-lg">
        {bloque.replace(/bloque(\d)/i, "Bloque $1")}
      </h2>
      {exercises.map((exercise, index) => (
        <div
          key={`exercise-${index}`}
          className="flex flex-col gap-2 border border-slate-600 shadow-md shadow-slate-900 p-4 mb-6 rounded-lg bg-slate-800/80 transition-colors duration-200 hover:border-blue-400 text-left"
        >
          <label htmlFor={`name-${index}`} className="block mb-1 text-slate-200 font-semibold">
            Nombre del ejercicio
          </label>
          <AutoCompleteInputEj
            ejercicios={ejercicios}
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
      ))}
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
