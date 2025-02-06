'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Exercise, Plani, TrainingDay } from '@/types/plani';

const EditPlani = () => {
    const searchParams = useSearchParams();
    const queryPlaniID = searchParams.get('planiID');
    const [plani, setPlani] = useState<Plani>();
    const [editedPlani, setEditedPlani] = useState<Plani>({
        month: '',
        year: '',
        userId: '',
        email: '',
        trainingDays: [],
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        if (queryPlaniID) {
            fetch(`/api/planillas?planiID=${queryPlaniID}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error fetching plani');
                    }
                    return response.json();
                })
                .then(data => {
                    setPlani(data);
                    setEditedPlani(JSON.parse(JSON.stringify(data))); // Crear una copia profunda de data
                })
                .catch(error => console.error('Error fetching plani:', error));
        }
    }, [queryPlaniID]);

    if (!plani) {
        return <div>Cargando...</div>;
    }

    const handleInputChange = (dayIndex: number, bloqueKey: 'Bloque1' | 'Bloque2' | 'Bloque3' | 'Bloque4', exerciseIndex: number, field: string, value: string | number) => {
        const updatedTrainingDays = [...editedPlani.trainingDays];
        if (!updatedTrainingDays[dayIndex][bloqueKey]) {
            updatedTrainingDays[dayIndex][bloqueKey] = [] as Exercise[];
        }
        updatedTrainingDays[dayIndex][bloqueKey][exerciseIndex] = {
            ...updatedTrainingDays[dayIndex][bloqueKey][exerciseIndex],
            [field]: value,
        };
        setEditedPlani({
            ...editedPlani,
            trainingDays: updatedTrainingDays,
        });
        console.log('editedPlani:', editedPlani);
        console.log('plani:', plani);
    };

    const handlePlaniChange = (field: string, value: string | number) => {
        setEditedPlani({
            ...editedPlani,
            [field]: value,
        });
    };

    // Agregar un nuevo ejercicio al bloque indicado
    const handleAddExecrcise = (e: React.MouseEvent<HTMLButtonElement>, dayIndex: number, bloqueKey: 'Bloque1' | 'Bloque2' | 'Bloque3' | 'Bloque4') => {
        e.preventDefault();
        const newExercise = { name: '', reps: '', sets: 0, notas: '', videoLink: '' };
        const updatedTrainingDays = [...editedPlani.trainingDays];
        if (!updatedTrainingDays[dayIndex][bloqueKey]) {
            updatedTrainingDays[dayIndex][bloqueKey] = [] as Exercise[];
        }
        updatedTrainingDays[dayIndex][bloqueKey] = [
            ...updatedTrainingDays[dayIndex][bloqueKey],
            newExercise
        ];
        setEditedPlani({
            ...editedPlani,
            trainingDays: updatedTrainingDays,
        });
    };

    // Agregar un nuevo día con 4 bloques vacíos
    const handleAddDay = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const newDay = {
            day: 'Nuevo Día',
            Bloque1: [] as Exercise[],
            Bloque2: [] as Exercise[],
            Bloque3: [] as Exercise[],
            Bloque4: [] as Exercise[]
        };
        setEditedPlani({
            ...editedPlani,
            trainingDays: [...editedPlani.trainingDays, newDay]
        });
    };

    return (
        <div className='flex flex-col items-center'>
            <form>
                <h1 className='text-2xl font-bold mb-4'>Editar planilla {queryPlaniID}</h1>
                {/* Aquí puedes agregar un formulario para editar la planilla */}
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Mes</label>
                    <input type="text" value={editedPlani.month} onChange={(e) => handlePlaniChange('month', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Año</label>
                    <input type="text" value={editedPlani.year} onChange={(e) => handlePlaniChange('year', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>ID de Usuario</label>
                    <input type="text" value={editedPlani.userId} onChange={(e) => handlePlaniChange('userId', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
                    <input type="text" value={editedPlani.email} onChange={(e) => handlePlaniChange('email', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Fecha de Inicio</label>
                    <input type="Date" value={editedPlani.startDate} onChange={(e) => handlePlaniChange('startDate', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Fecha de Fin</label>
                    <input type="Date" value={editedPlani.endDate} onChange={(e) => handlePlaniChange('endDate', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                </div>
                {editedPlani.trainingDays.map((trainingDay, dayIndex) => (
                    <div key={dayIndex} className='my-6 flex flex-wrap gap-10 items-center  bg-slate-200 p-5'>
                        <h2 className='text-xl font-bold mb-2'>{trainingDay.day}</h2>
                        {trainingDay.Bloque1 && trainingDay.Bloque1.length > 0 && (
                            <div className='my-4 bg-white p-5 mx-auto'>
                                <h3 className='text-lg font-semibold mb-2'>Bloque1</h3>
                                {trainingDay.Bloque1.map((exercise, exerciseIndex) => (
                                    <div key={exerciseIndex} className='mb-2 bg-green-50 p-5'>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Nombre</label>
                                        <input type="text" value={exercise.name} onChange={(e) => handleInputChange(dayIndex, 'Bloque1', exerciseIndex, 'name', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Repeticiones</label>
                                        <input type="text" value={exercise.reps} onChange={(e) => handleInputChange(dayIndex, 'Bloque1', exerciseIndex, 'reps', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Sets</label>
                                        <input type="text" value={exercise.sets} onChange={(e) => handleInputChange(dayIndex, 'Bloque1', exerciseIndex, 'sets', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Notas</label>
                                        <input type="text" value={exercise.notas} onChange={(e) => handleInputChange(dayIndex, 'Bloque1', exerciseIndex, 'notas', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Video Link</label>
                                        <input type="text" value={exercise.videoLink} onChange={(e) => handleInputChange(dayIndex, 'Bloque1', exerciseIndex, 'videoLink', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <button 
                                        onClick={(e) => {
                                            handleAddExecrcise(e, dayIndex, 'Bloque1');
                                        }}
                                        className='bg-emerald-500/50 px-2 py-1 m-2 flex mx-auto rounded-md'>Agregar Ejercicio</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {trainingDay.Bloque2 && trainingDay.Bloque2.length > 0 && (
                            <div className='my-4 bg-white p-5'>
                                <h3 className='text-lg font-semibold mb-2'>Bloque2</h3>
                                {trainingDay.Bloque2.map((exercise, exerciseIndex) => (
                                    <div key={exerciseIndex} className='mb-2'>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Nombre</label>
                                        <input type="text" value={exercise.name} onChange={(e) => handleInputChange(dayIndex, 'Bloque2', exerciseIndex, 'name', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Repeticiones</label>
                                        <input type="text" value={exercise.reps} onChange={(e) => handleInputChange(dayIndex, 'Bloque2', exerciseIndex, 'reps', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Sets</label>
                                        <input type="text" value={exercise.sets} onChange={(e) => handleInputChange(dayIndex, 'Bloque2', exerciseIndex, 'sets', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Notas</label>
                                        <input type="text" value={exercise.notas} onChange={(e) => handleInputChange(dayIndex, 'Bloque2', exerciseIndex, 'notas', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Video Link</label>
                                        <input type="text" value={exercise.videoLink} onChange={(e) => handleInputChange(dayIndex, 'Bloque2', exerciseIndex, 'videoLink', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <button 
                                        onClick={(e) => {
                                            handleAddExecrcise(e, dayIndex, 'Bloque2');
                                        }}
                                        className='bg-emerald-500/50 px-2 py-1 m-2 flex mx-auto rounded-md'>Agregar Ejercicio</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {trainingDay.Bloque3 && trainingDay.Bloque3.length > 0 && (
                            <div className='my-4 bg-white p-5'>
                                <h3 className='text-lg font-semibold mb-2'>Bloque3</h3>
                                {trainingDay.Bloque3.map((exercise, exerciseIndex) => (
                                    <div key={exerciseIndex} className='mb-2'>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Nombre</label>
                                        <input type="text" value={exercise.name} onChange={(e) => handleInputChange(dayIndex, 'Bloque3', exerciseIndex, 'name', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Repeticiones</label>
                                        <input type="text" value={exercise.reps} onChange={(e) => handleInputChange(dayIndex, 'Bloque3', exerciseIndex, 'reps', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Sets</label>
                                        <input type="text" value={exercise.sets} onChange={(e) => handleInputChange(dayIndex, 'Bloque3', exerciseIndex, 'sets', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Notas</label>
                                        <input type="text" value={exercise.notas} onChange={(e) => handleInputChange(dayIndex, 'Bloque3', exerciseIndex, 'notas', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Video Link</label>
                                        <input type="text" value={exercise.videoLink} onChange={(e) => handleInputChange(dayIndex, 'Bloque3', exerciseIndex, 'videoLink', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <button 
                                        onClick={(e) => {
                                            handleAddExecrcise(e, dayIndex, 'Bloque3');
                                        }}
                                        className='bg-emerald-500/50 px-2 py-1 m-2 flex mx-auto rounded-md'>Agregar Ejercicio</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {trainingDay.Bloque4 && trainingDay.Bloque4.length > 0 && (
                            <div className='my-4 bg-white p-5 mx-auto'>
                                <h3 className='text-lg font-semibold mb-2'>Bloque4</h3>
                                {trainingDay.Bloque4.map((exercise, exerciseIndex) => (
                                    <div key={exerciseIndex} className='mb-2 bg-green-100 p-5'>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Nombre</label>
                                        
                                        
                                        <input type="text" value={exercise.name} onChange={(e) => handleInputChange(dayIndex, 'Bloque4', exerciseIndex, 'name', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Repeticiones</label>
                                        <input type="text" value={exercise.reps} onChange={(e) => handleInputChange(dayIndex, 'Bloque4', exerciseIndex, 'reps', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Sets</label>
                                        <input type="text" value={exercise.sets} onChange={(e) => handleInputChange(dayIndex, 'Bloque4', exerciseIndex, 'sets', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Notas</label>
                                        <input type="text" value={exercise.notas} onChange={(e) => handleInputChange(dayIndex, 'Bloque4', exerciseIndex, 'notas', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <label className='block text-gray-700 text-sm font-bold mb-1'>Video Link</label>
                                        <input type="text" value={exercise.videoLink} onChange={(e) => handleInputChange(dayIndex, 'Bloque4', exerciseIndex, 'videoLink', e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                        <button 
                                        onClick={(e) => {
                                            handleAddExecrcise(e, dayIndex, 'Bloque4');
                                        }}
                                        className='bg-emerald-500/50 px-2 py-1 m-2 flex mx-auto rounded-md'>Agregar Ejercicio</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <button onClick={handleAddDay} className='flex m-auto bg-blue-500/60 px-2 py-1 rounded-md my-4'>
                    Agregar Día
                </button>
                <button className='flex m-auto bg-green-600/60 px-2 py-1 rounded-md'>Guardar</button>
            </form>
        </div>
    );
};

export default EditPlani;