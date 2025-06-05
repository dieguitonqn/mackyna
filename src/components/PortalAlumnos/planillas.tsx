'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Exercise, Plani, TrainingDay } from '@/types/plani';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaSave, FaPrint, FaSearchPlus, FaSearchMinus, FaEdit, FaTrashAlt, FaCalendarAlt, FaDumbbell, FaListOl, FaLayerGroup } from "react-icons/fa";
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
    const [zoomLevel, setZoomLevel] = useState<number>(1);
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
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
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

    const handleZoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 0.1, 2));
    };

    const handleZoomOut = () => {
        setZoomLevel((prev) => Math.max(prev - 0.1, 1));
    };

    return (
        <div className="min-h-screen p-4">
            <div className="flex justify-center">
                <h1 className="text-4xl font-bold mb-4 text-center text-gray-200">Rutinas de entrenamiento de {userName ? userName : session?.user.name}</h1>
            </div>

            {planillasUser ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {planillasUser.map((plani) => (
                        <div
                            key={plani._id}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col items-center gap-4 border border-gray-100"
                            onClick={() => handleViewPlanilla(plani)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Ver planilla de ${plani.month} ${plani.year}`}
                        >
                            <div className="relative w-24 h-24 transition-transform duration-200 group-hover:scale-105">
                                <Image 
                                    src="/planilla.png" 
                                    alt="Icono de planilla" 
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 96px) 100vw, 96px"
                                />
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                <FaCalendarAlt className="text-gray-500" />
                                {plani.month} {plani.year}
                            </h3>
                            {(isAdmin || isTeach) && (
                                <div className="flex items-center gap-3 mt-2">
                                    <button
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePlani(plani._id!, plani.userId);
                                        }}
                                        aria-label={`Borrar planilla de ${plani.month} ${plani.year}`}
                                    >
                                        <FaTrashAlt className="w-4 h-4" />
                                        Borrar
                                    </button>
                                    <button
                                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push('/portalProfes/editPlani?planiID=' + plani._id);
                                        }}
                                        aria-label={`Editar planilla de ${plani.month} ${plani.year}`}
                                    >
                                        <FaEdit className="w-4 h-4" />
                                        Editar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center p-8">
                    <p className="text-gray-500 text-lg">Cargando planillas...</p>
                </div>
            )}

            {selectedPlani && (
                <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto print:overflow-visible print:static print:bg-white print:bg-opacity-100" role="dialog" aria-modal="true" aria-labelledby="planilla-title">
                    <div className="bg-white rounded-lg shadow-xl w-full  md:w-3/4 max-w-5xl  print:shadow-none print:w-full print:max-w-none" id="printable-content">
                        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center gap-4 print:hidden">
                            <div className="flex gap-3">
                                <button
                                    onClick={handlePrint}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                    aria-label="Imprimir planilla"
                                >
                                    <FaPrint className="h-5 w-5" /> Imprimir
                                </button>
                                <div className="flex rounded-lg overflow-hidden border border-gray-200">
                                    <button
                                        className="p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                                        onClick={() => setZoomLevel(z => Math.min(z + 0.1, 2))}
                                        aria-label="Aumentar zoom"
                                    >
                                        <FaSearchPlus className="h-5 w-5 text-gray-700" />
                                    </button>
                                    <button
                                        className="p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border-l"
                                        onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.7))}
                                        aria-label="Reducir zoom"
                                    >
                                        <FaSearchMinus className="h-5 w-5 text-gray-700" />
                                    </button>
                                </div>
                            </div>
                            <button
                                className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                                onClick={closeModal}
                                aria-label="Cerrar planilla"
                            >
                                <IoCloseCircleSharp className="h-9 w-9" />
                            </button>
                        </div>

                        <div className="p-6 print-content" style={{ zoom: zoomLevel, transition: 'all 0.2s' }}>
                            <div className="max-w-4xl mx-auto">
                                <h2 id="planilla-title" className="text-2xl font-bold mb-6 text-gray-800">
                                    Planilla: {selectedPlani.month} {selectedPlani.year}
                                </h2>
                                <div className="flex justify-between mb-6 text-gray-600">
                                    <h3 className="font-medium">
                                        Desde: {formatDate(selectedPlani.startDate)}
                                    </h3>
                                    <h3 className="font-medium">
                                        Hasta: {formatDate(selectedPlani.endDate)}
                                    </h3>
                                </div>

                                {selectedPlani.trainingDays.map((day, dayIndex) => (
                                    <div key={dayIndex} className="mb-6 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                        <h3 className="text-xl font-bold text-center py-3 bg-gray-100 border-b text-gray-800">
                                            {day.day}
                                        </h3>
                                        <div className="p-4 space-y-4">
                                            {Object.entries(day).map(([bloque, ejercicios]) => (
                                                bloque.startsWith('Bloque') && ejercicios.length > 0 && (
                                                    <div key={bloque} className="bg-white rounded-lg p-4 shadow-sm">
                                                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                            <FaLayerGroup className="text-blue-600" />
                                                            {bloque}
                                                        </h4>
                                                        <ul className="space-y-4">
                                                            {ejercicios.map((exercise: Exercise, exerciseIndex: number) => (
                                                                <li key={exerciseIndex} className="pb-4 border-b border-gray-100 last:border-0">
                                                                    <div className="grid gap-2 text-gray-800">
                                                                        <p className="flex items-center gap-2 text-sm">
                                                                            <FaDumbbell className="text-blue-600" />
                                                                            <span className="text-gray-600">Ejercicio:</span> 
                                                                            <span className="font-bold text-base text-gray-900">{exercise.name}</span>
                                                                        </p>
                                                                        <p className="flex items-center gap-2 text-sm">
                                                                            <FaListOl className="text-blue-600" />
                                                                            <span className="text-gray-600">Repeticiones:</span>
                                                                            <span className="font-bold text-base text-gray-900">{exercise.reps}</span>
                                                                        </p>
                                                                        <p className="flex items-center gap-2 text-sm">
                                                                            <FaLayerGroup className="text-blue-600" />
                                                                            <span className="text-gray-600">Series:</span>
                                                                            <span className="font-bold text-base text-gray-900">{exercise.sets}</span>
                                                                        </p>
                                                                        
                                                                        <div className="flex items-start gap-3 mt-2">
                                                                            <span className="font-medium pt-2 text-gray-800">Notas:</span>
                                                                            <div className="flex-1">
                                                                                <textarea
                                                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 text-gray-800"
                                                                                    value={exercise.notas || ''}
                                                                                    onChange={(e) => handleInputChange(dayIndex, bloque, exerciseIndex, e.target.value)}
                                                                                    rows={1}
                                                                                    style={{ minHeight: '2.5rem' }}
                                                                                    onInput={(e) => {
                                                                                        const target = e.target as HTMLTextAreaElement;
                                                                                        target.style.height = 'auto';
                                                                                        target.style.height = target.scrollHeight + 'px';
                                                                                    }}
                                                                                    ref={(textarea) => {
                                                                                        if (textarea) {
                                                                                            textarea.style.height = 'auto';
                                                                                            textarea.style.height = textarea.scrollHeight + 'px';
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <button
                                                                                onClick={() => handleSaveNote()}
                                                                                className="inline-flex items-center px-3 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors duration-200 font-medium"
                                                                                aria-label="Guardar notas"
                                                                            >
                                                                                <FaSave className="h-5 w-5" />
                                                                            </button>
                                                                        </div>
                                                                        
                                                                        {exercise.videoLink && (
                                                                            <div className="flex items-center gap-2 mt-2">
                                                                                <span className="font-medium text-gray-800">Video:</span>
                                                                                <a 
                                                                                    href={exercise.videoLink}
                                                                                    className="inline-flex items-center text-red-700 hover:text-red-800 transition-colors duration-200"
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    aria-label="Ver video del ejercicio"
                                                                                >
                                                                                    <ImYoutube2 className="h-8 w-8" />
                                                                                </a>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Planillas;
