import React, { useEffect, useState } from 'react';
import { Exercise } from '@/types/plani';
import AutoCompleteInputEj from './AutoCompleteEjercicio';

interface Props {
    day:string,
    bloque: string;
    onChange: (day:string, bloque: string, exercises: Exercise[]) => void;
}

type Ejercicio = {
    _id: string;
    nombre: string;
    grupoMusc: string;
    specificMusc: string;
    description: string;
    video: string;
};
const ExerciseForm: React.FC<Props> = ({ day, bloque, onChange }) => {
    const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]); // Estado de usuarios
    // const [selectedEjercicio, setSelectedEjercicio] = useState<Ejercicio>(); // Usuario seleccionado

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/ejercicios');
                const ejerciciosDB = await response.json();
                const ejerciciosWithStringId = ejerciciosDB.map((ejercicio: Ejercicio) => ({
                    ...ejercicio,
                    id: ejercicio._id.toString(), // Convertir ObjectId a string
                }));

                setEjercicios(ejerciciosWithStringId);
                // console.log(ejerciciosWithStringId);
            } catch (err) {
                console.error('Error al obtener usuarios:', err);
            }
        };
        fetchUsers();
    }, []);
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const handleAddExercise = () => {
        const newExercise: Exercise = { name: '', reps: '', sets: 1, videoLink: '' };
        const updatedExercises = [...exercises, newExercise];
        setExercises(updatedExercises);
        onChange(day, bloque, updatedExercises);
    };

    const handleRemoveExercise = (index: number) => {
        const updatedExercises = exercises.filter((_, i) => i !== index);
        setExercises(updatedExercises);
        onChange(day, bloque, updatedExercises);
    };

    const handleInputChange = (index: number, field: keyof Exercise, value: string | number) => {
        const updatedExercises = [...exercises];
        updatedExercises[index] = { ...updatedExercises[index], [field]: value };
        setExercises(updatedExercises);
        onChange(day,bloque, updatedExercises);
    };

    const handleSelectEjercicio = (index: number, ejercicio: Ejercicio) => {
        const updatedExercises = [...exercises];
        updatedExercises[index] = {
            ...updatedExercises[index],
            name: ejercicio.nombre,
            videoLink: ejercicio.video
        };
        setExercises(updatedExercises);
        onChange(day ,bloque, updatedExercises);
    };
   
    return (
        <div className='flex flex-col justify-center text-center border border-slate-300 p-5 m-5 shadow-md rounded-md bg-white'>
            <h2 className='shadow-lg py-2 px-4 my-4 border border-slate-200 text-2xl'>
                {bloque.replace(/bloque(\d)/i, 'Bloque $1')}
            </h2>
            {exercises.map((exercise, index) => (
                <div key={`exercise-${index}`} style={{ marginBottom: '1rem' }} className='flex flex-col border border-gray-200 shadow shadow-gray-500 p-2 text-left'>
                    <label htmlFor={`name-${index}`} style={{ display: 'block', marginBottom: '0.2rem' }}>
                        Nombre del ejercicio
                    </label>
                    {/* <input
                        id={`name-${index}`}
                        type="text"
                        placeholder="Nombre del ejercicio"
                        value={exercise.name}
                        onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                        className='mb-4 shadow-sm    p-1 border border-slate-200' /> */}
                    <AutoCompleteInputEj
                        ejercicios={ejercicios}
                        onSelect={(ejercicio) => handleSelectEjercicio(index, ejercicio)}
                        initialValue={exercise.name}
                    />
                    <label htmlFor={`reps-${index}`} style={{ display: 'block', marginBottom: '0.2rem' }}>
                        Repeticiones
                    </label>
                    <input
                        id={`reps-${index}`}
                        type="text"
                        value={exercise.reps}
                        onChange={(e) => handleInputChange(index, 'reps', e.target.value)}
                        className='mb-4 shadow-sm    p-1 border border-slate-200' required />

                    <label htmlFor={`sets-${index}`} style={{ display: 'block', marginBottom: '0.2rem' }}>
                        Series
                    </label>
                    <input
                        id={`sets-${index}`}
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => handleInputChange(index, 'sets', parseInt(e.target.value))}
                        className='mb-4 shadow-sm    p-1 border border-slate-200' required 
                        min={1}/>

                    <label htmlFor={`videoLink-${index}`} style={{ display: 'block', marginBottom: '0.2rem' }}>
                        Enlace al video
                    </label>
                    <input
                        id={`videoLink-${index}`}
                        type="text"
                        placeholder="Enlace al video"
                        value={exercise.videoLink || ''}
                        onChange={(e) => handleInputChange(index, 'videoLink', e.target.value)}
                        className='mb-4 shadow-sm    p-1 border border-slate-200'  />
                    <div className='flex flex-col justify-center'>
                        <button
                            type="button"
                            onClick={() => handleRemoveExercise(index)}
                            className='bg-red-500/50 rounded-md border border-slate-500 shadow-sm w-1/2 m-auto'>
                            Borrar Ejercicio
                        </button>
                    </div>

                </div>

            ))}
            <button
                type="button"
                onClick={handleAddExercise}
                className='bg-green-500/50 py-1 px-2 rounded-md border border-slate-500 shadow-sm'>
                Agregar Ejercicio
            </button>

        </div>
    );
};

export default ExerciseForm;
