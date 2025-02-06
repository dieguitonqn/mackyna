'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Exercise, Plani, TrainingDay } from '@/types/plani';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaSave, FaPrint } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import { ImYoutube2 } from "react-icons/im";

const Planillas: React.FC = () => {
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const [planillasUser, setPlanillasUser] = useState<Plani[] | null>(null);
    const [selectedPlani, setSelectedPlani] = useState<Plani | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isTeach, setIsTeach] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const router = useRouter();


    useEffect(() => {
        const fetchPlanis = async () => {
            const user_id = searchParams.get('id');
            try {
                if (session?.user.rol === "admin") {
                    setIsAdmin(true);
                } else if (session?.user.rol === "teach") {
                    setIsTeach(true);
                }
                if (user_id) {
                    const response = await fetch(`/api/planillas?id=${user_id}`);
                    if (!response.ok) {
                        throw new Error('Error obteniendo las planillas del usuario');
                    }
                    const planillas = await response.json();
                    setPlanillasUser(planillas);

                    const responseUser = await fetch(`/api/usuarios?id=${user_id}`);
                    if (!responseUser.ok) {
                        throw new Error('Error obteniendo el usuario');
                    }
                    setUserName((await responseUser.json()).nombre);

                } else if (session) {
                    const userId = session.user.id;
                    const response = await fetch(`/api/planillas?id=${userId}`);
                    if (!response.ok) {
                        throw new Error('Error obteniendo las planillas del usuario');
                    }
                    const planillas = await response.json();
                    setPlanillasUser(planillas);
                }

            } catch (err: unknown) {
                console.error(err);
            }
        };
        fetchPlanis();
    }, [searchParams, session]);

    const handleViewPlanilla = (plani: Plani) => {
        setSelectedPlani(plani);
    };

    const closeModal = () => {
        setSelectedPlani(null);
    };

    const handleInputChange = (
        dayIndex: number,
        bloque: string, // Aceptamos un string inicialmente
        exerciseIndex: number,
        value: string
    ) => {
        if (selectedPlani) {
            const updatedPlani = { ...selectedPlani };
            const trainingDay = updatedPlani.trainingDays[dayIndex];

            // Aseguramos que `bloque` es una clave válida de TrainingDay
            if (trainingDay && Object.prototype.hasOwnProperty.call(trainingDay, bloque)) {
                const exercises = trainingDay[bloque as keyof TrainingDay];
                if (Array.isArray(exercises)) {
                    exercises[exerciseIndex].notas = value; // Actualizamos "notas"
                }
            }
            setSelectedPlani(updatedPlani);
            console.log(updatedPlani)
        }
    };

    const handleSaveNote = async () => {
        console.log("a guardar en la base de datos");
        console.log(selectedPlani?._id);

        try {
            // Enviar los datos al backend
            const response = await fetch(`/api/planillas`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedPlani?._id,
                    plani: selectedPlani
                }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar las notas');
            }

            alert('Notas guardadas con éxito');
        } catch (error) {
            console.error(error);
            alert('Hubo un error al guardar las notas');
        }

    }




    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    };



    const handleDeletePlani = async (id: string, userId: string) => {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas borrar esta rutina?");
        if (!isConfirmed) {
            return;
        }
        const responseDel = await fetch(`/api/planillas?id=${id}`, { method: 'DELETE' });
        if (!responseDel.ok) {
            throw new Error('Error al borrar el usuario');
        }
        alert("Planilla borrada con éxito");
        router.push(`/portalAlumnos/Planilla?id=${userId}`);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen p-4">
            <div className="flex justify-center">
                <h1 className="text-4xl font-bold mb-4 text-center text-gray-200">Rutinas de entrenamiento de {userName ? userName : session?.user.name}</h1>
            </div>

            {planillasUser ? (
                <div className="flex flex-wrap border-black gap-10">
                    {planillasUser.map((plani) => (
                        <div
                            key={plani._id}
                            className="cursor-pointer border p-4 rounded-md flex flex-col items-center bg-gray-200 hover:bg-lime-100 shadow-black shadow-sm"
                            onClick={() => handleViewPlanilla(plani)}
                        >
                            <Image src="/planilla.png" alt="logo planilla" width={100} height={100} />
                            <p className="text-center">{plani.month} {plani.year}</p>
                            {(isAdmin || isTeach) && (
                                <div className='flex flex-wrap items-center gap-2'>
                                    <button
                                        className="bg-red-500 px-2 py-1 hover:font-semibold rounded-md mt-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePlani(plani._id!, plani.userId);
                                        }}
                                    >
                                        Borrar
                                    </button>
                                    <button
                                        className='bg-emerald-600 px-2 py-1 hover:font-semibold rounded-md mt-2'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // alert('Funcionalidad no implementada aún');
                                            router.push('/portalProfes/editPlani?planiID=' + plani._id);
                                        }
                                        }
                                    >
                                        Editar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Cargando planillas...</p>
            )}

            {selectedPlani && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto print:overflow-visible print:static print:bg-white print:bg-opacity-100">
                    <div className="bg-white p-6 rounded shadow-lg w-full mx-1 md:w-3/4 max-w-4xl print:shadow-none print:w-full print:max-w-none" id="printable-content">
                        <div className='flex justify-between items-center mb-4 print:hidden'>
                            <button
                                onClick={handlePrint}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600"
                            >
                                <FaPrint /> Imprimir
                            </button>
                            <button
                                className="text-white bg-red-500 rounded-md p-1 font-bold text-xl"
                                onClick={closeModal}
                            >
                                <IoCloseCircleSharp className='h-7 w-7' />
                            </button>
                        </div>

                        <div className="print-content">
                            <h2 className="text-xl font-bold mb-4">Planilla: {selectedPlani.month} {selectedPlani.year}</h2>
                            <div className='flex justify-between'>
                                <h2 className="text-md font-bold mb-4">
                                    Desde: {formatDate(selectedPlani.startDate)}
                                </h2>
                                <h2 className="text-md font-bold mb-4">
                                    Hasta: {formatDate(selectedPlani.endDate)}
                                </h2>
                            </div>

                            {selectedPlani.trainingDays.map((day, dayIndex) => (
                                <div key={dayIndex} className="mt-4 bg-slate-100 rounded-md p-5 border">
                                    <h3 className="text-2xl font-bold text-center">{day.day}</h3>
                                    {Object.entries(day).map(([bloque, ejercicios]) => (
                                        bloque.startsWith('Bloque') && ejercicios.length > 0 && (
                                            <div key={bloque} className="mt-2 shadow-sm shadow-black p-2  ">
                                                <h4 className="text-md font-semibold">{bloque}</h4>
                                                <ul className="list-disc pl-5  ">
                                                    {ejercicios.map((exercise: Exercise, exerciseIndex: number) => (
                                                        <li key={exerciseIndex} className='border-b-slate-400 border-b my-1'>
                                                            <p><strong>Ejercicio:</strong> {exercise.name}</p>
                                                            <p><strong>Repeticiones:</strong> {exercise.reps}</p>
                                                            <p><strong>Series:</strong> {exercise.sets}</p>
                                                            <div className='flex flex-row items-center  my-2'>
                                                                <strong>Notas:</strong>
                                                                <div>
                                                                    <input
                                                                        type="text"
                                                                        className="flex shadow-sm rounded-sm p-1 w-full border border-slate-200"
                                                                        value={exercise.notas || ''}
                                                                        onChange={(e) =>
                                                                            handleInputChange(dayIndex, bloque, exerciseIndex, e.target.value)
                                                                        }
                                                                    />
                                                                </div>

                                                                <button
                                                                    onClick={() => handleSaveNote()}
                                                                    className='flex border border-slate-300 bg-green-200 rounded-sm hover:border-2 hover:bg-green-500'
                                                                >
                                                                    <FaSave
                                                                        className='h-8 w-8 p-1' />
                                                                </button>
                                                            </div>
                                                            {exercise.videoLink && (
                                                                <p className='flex flex-row items-center gap-2 mb-1'>
                                                                    <strong>Video:</strong>
                                                                    <a href={exercise.videoLink} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer"> <span className='text-red-600'><ImYoutube2 className='h-7 w-12  rounded-md bg-slate-300 px-0.5 hover:border-none border' /></span></a>
                                                                </p>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Planillas;
