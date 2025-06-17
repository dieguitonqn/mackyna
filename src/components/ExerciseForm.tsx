import React, { useCallback, useEffect, useState, useRef } from "react";
import { Exercise } from "@/types/plani";
import AutoCompleteInputEj from "@/components/AutoCompleteEjercicio";

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
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>(() =>
    initialExercises || [
      {
        name: "",
        reps: "",
        sets: 1,
        notas: "",
        videoLink: "",
      },
    ]
  );

  // Referencia para evitar la primera notificación
  const isInitialMount = useRef(true);
  // Timer para debounce
  const updateTimer = useRef<NodeJS.Timeout>();

  // Efecto para cargar ejercicios solo una vez al montar
  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await fetch("/api/ejercicios");
        const ejerciciosDB = await response.json();
        const ejerciciosWithStringId = ejerciciosDB.map(
          (ejercicio: Ejercicio) => ({
            ...ejercicio,
            id: ejercicio._id.toString(),
          })
        );
        setEjercicios(ejerciciosWithStringId);
      } catch (err) {
        console.error("Error al obtener ejercicios:", err);
      }
    };
    fetchEjercicios();
  }, []); // Solo al montar el componente

  // Efecto para actualizar ejercicios cuando cambian las props iniciales
  useEffect(() => {
    if (initialExercises) {
      setExercises(initialExercises);
      // No notificamos al padre aquí ya que estos son los valores iniciales
    }
  }, [initialExercises]);

  // Función para notificar cambios al padre con debounce
  const notifyParent = useCallback(() => {
    if (updateTimer.current) {
      clearTimeout(updateTimer.current);
    }
    updateTimer.current = setTimeout(() => {
      onChange(day, bloque, exercises);
    }, 300);
  }, [onChange, day, bloque, exercises]);

  // Efecto para notificar cambios al padre
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    notifyParent();
    // Cleanup
    return () => {
      if (updateTimer.current) {
        clearTimeout(updateTimer.current);
      }
    };
  }, [exercises, notifyParent]);

  const handleAddExercise = useCallback(() => {
    const newExercise: Exercise = {
      name: "",
      reps: "",
      sets: 1,
      notas: "",
      videoLink: "",
    };
    setExercises((prev) => [...prev, newExercise]);
  }, []);

  const handleRemoveExercise = useCallback(
    (index: number) => {
      setExercises((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        return updated;
      });
    },
    []
  );

  const handleInputChange = useCallback(
    (index: number, field: keyof Exercise, value: string | number) => {
      setExercises((prev) => {
        const updated = [...prev];
        // Validaciones específicas por campo
        if (field === "sets" && typeof value === "number" && value < 1) {
          value = 1; // Mínimo 1 serie
        }
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    },
    []
  );

  const handleSelectEjercicio = useCallback(
    (index: number, ejercicio: Ejercicio) => {
      setExercises((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          name: ejercicio.nombre,
          videoLink: ejercicio.video,
        };
        return updated;
      });
    },
    []
  );

  return (
    <div className="flex flex-col justify-center text-center border-2 border-slate-700 p-5 m-5 shadow-lg rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700/80">
      <h2 className="shadow py-2 px-4 my-4 border border-slate-600 text-2xl font-bold text-slate-100 bg-slate-800/80 rounded-lg">
        {bloque.replace(/bloque(\d)/i, "Bloque $1")}
      </h2>
      {exercises.map((exercise, index) => (
        <div
          key={`exercise-${index}-${exercise.name}`}
          className="flex flex-col gap-2 border border-slate-600 shadow-md shadow-slate-900 p-4 mb-6 rounded-lg bg-slate-800/80 transition-colors duration-200 hover:border-blue-400 text-left"
        >
          <label
            htmlFor={`name-${index}`}
            className="block mb-1 text-slate-200 font-semibold"
          >
            Nombre del ejercicio
          </label>
          <AutoCompleteInputEj
            ejercicios={ejercicios}
            onSelect={(ejercicio) => handleSelectEjercicio(index, ejercicio)}
            initialValue={exercise.name as string}
          />
          <label
            htmlFor={`reps-${index}`}
            className="block mb-1 text-slate-300 font-semibold"
          >
            Repeticiones
          </label>
          <input
            id={`reps-${index}`}
            type="text"
            value={exercise.reps}
            onChange={(e) => handleInputChange(index, "reps", e.target.value)}
            className="mb-2 shadow-sm p-2 border border-slate-600 bg-slate-900 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
          />
          <label
            htmlFor={`sets-${index}`}
            className="block mb-1 text-slate-300 font-semibold"
          >
            Series
          </label>
          <input
            id={`sets-${index}`}
            type="number"
            value={exercise.sets}
            onChange={(e) =>
              handleInputChange(index, "sets", parseInt(e.target.value))
            }
            className="mb-2 shadow-sm p-2 border border-slate-600 bg-slate-900 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
            min={1}
          />
          <label
            htmlFor={`videoLink-${index}`}
            className="block mb-1 text-slate-300 font-semibold"
          >
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
