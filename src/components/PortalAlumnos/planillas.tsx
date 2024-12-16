'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Exercise, Plani, TrainingDay } from '@/types/plani';
import Image from 'next/image';
import{ useRouter} from 'next/navigation';

const Planillas: React.FC = () => {

    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const [planillasUser, setPlanillasUser] = useState<Plani[] | null>(null);
    const [selectedPlani, setSelectedPlani] = useState<Plani | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [isTeach, setIsTeach] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        const fetchPlanis = async () => {
            const plani_id = searchParams.get('id');
            try {
                if (session?.user.rol == "admin") {
                    setIsAdmin(true)
                } else if (session?.user.rol == "teach")
                    setIsTeach(true)
                if (plani_id) {
                    const response = await fetch(`/api/planillas?id=${plani_id}`);
                    if (!response.ok) {
                        throw new Error('Error obteniendo las planillas del usuario');
                    }
                    const planillas = await response.json();
                    setPlanillasUser(planillas);
                } else if (session) {
                    const userId = session.user.id;
                    const response = await fetch(`/api/planillas?id=${userId}`);
                    if (!response.ok) {
                        throw new Error('Error obteniendo las planillas del usuario');
                    }
                    const planillas = await response.json();
                    setPlanillasUser(planillas);
                } else {
                    const response = await fetch(`/api/planillas`);
                    if (!response.ok) {
                        throw new Error('Error obteniendo las planillas del usuario');
                    }
                    const planillas = await response.json();
                    console.log(planillas);
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

    const handleDeletePlani=async (id?:string)=>{
        const isConfirmed = window.confirm("¿Estás seguro de que deseas borrar esta rutina?");
        if (!isConfirmed) {
            return; // Si el usuario cancela, no se procede
        }
        const responseDel = await fetch(`/api/planillas?id=${id}`,
            {
                method: 'DELETE'
            }
        );
        if (!responseDel.ok) {
            throw new Error('Error al borrar el usuario');
        }
        alert("Planilla borrada con éxito");
        router.push(`/portalAlumnos/Planilla?id=${id}`);
        
    }

    return (
        <div className="min-h-screen p-4">
            <div className='flex justify-center '>
                <h1 className="text-4xl font-bold mb-4 text-center text-gray-200">Rutinas de entrenamiento</h1>
            </div>

            {planillasUser ? (
                <div className="flex flex-wrap border-black gap-10">
                    {planillasUser.map((plani) => (

                        <div
                            key={plani._id}
                            className="cursor-pointer border p-4 rounded-md flex flex-col items-center bg-gray-200 hover:bg-lime-100 shadow-black shadow-sm"
                            onClick={() => handleViewPlanilla(plani)}
                        >
                            <div className="flex items-center justify-center mb-2">
                                <Image
                                    src={"/planilla.png"}
                                    alt='logo planilla'
                                    width={100}
                                    height={100}
                                />
                            </div>
                            <p className="text-center">{plani.month} {plani.year}</p>
                            {(isAdmin || isTeach) && (
                                <div className='z-50'>
                                    <button 
                                    className='bg-red-500 px-2 py-1 hover:font-semibold rounded-md mt-2'
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        handleDeletePlani(plani._id)}}>
                                        Borrar
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-scroll">
                    <div className="bg-white p-6 rounded shadow-lg  w-full mx-1 md:w-3/4 max-w-lg">
                        <div className='flex justify-end'>
                            <button
                                className="absolute md:sticky  top-0 right-2 text-red-500 font-bold text-2xl bg-gray-400 px-2 py-1"
                                onClick={closeModal}
                            >
                                X
                            </button>
                        </div>
                        <div className='flex justify-center my-5'>
                            <Image
                                src={"/mackyna_verde.png"}
                                alt='logo'
                                width={150}
                                height={150}
                                className='mt-10 md:mt-0'
                            />
                        </div>

                        <h2 className="text-xl font-bold mb-4">Planilla: {selectedPlani.month} {selectedPlani.year}</h2>
                        <p><strong>Email:</strong> {selectedPlani.email}</p>
                        <p><strong>Fecha de inicio:</strong> {new Date(selectedPlani.startDate).toLocaleDateString()}</p>
                        <p><strong>Fecha de fin:</strong> {new Date(selectedPlani.endDate).toLocaleDateString()}</p>

                        {selectedPlani.trainingDays.map((day: TrainingDay, index) => (
                            <div key={index} className="    mt-4 bg-slate-100 rounded-md p-5 border">
                                <h3 className="text-2xl font-bold text-center">{day.day}</h3>
                                {Object.entries(day).map(([bloque, ejercicios]) => (
                                    bloque.startsWith('Bloque') && ejercicios && ejercicios.length > 0 && (
                                        <div key={bloque} className="mt-2 shadow-sm shadow-black p-2">
                                            <h4 className="text-md font-semibold">{bloque}</h4>
                                            <ul className="list-disc pl-5">
                                                {ejercicios.map((exercise: Exercise, idx: number) => (
                                                    <li key={idx}>
                                                        <p><strong>Nombre:</strong> {exercise.name}</p>
                                                        <p><strong>Repeticiones:</strong> {exercise.reps}</p>
                                                        <p><strong>Series:</strong> {exercise.sets}</p>
                                                        {exercise.videoLink && (
                                                            <p><strong>Video:</strong> <a href={exercise.videoLink} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">Ver</a></p>
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
            )}
        </div>
    );
};

export default Planillas;
