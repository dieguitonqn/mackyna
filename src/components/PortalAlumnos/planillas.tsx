'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Exercise, Plani, TrainingDay } from '@/types/plani';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaSave, FaPrint, FaSearchPlus, FaSearchMinus, FaEdit, FaTrashAlt, FaCalendarAlt, FaDumbbell, FaListOl, FaLayerGroup } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiClock } from 'react-icons/fi';
import { IoCloseCircleSharp } from "react-icons/io5";
import { ImYoutube2 } from "react-icons/im";
import { updatePlanillaNote } from './planillas.utils';
import Link from 'next/link';

const Planillas: React.FC = () => {
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const [planillasUser, setPlanillasUser] = useState<Plani[] | null>(null);
    const [selectedPlani, setSelectedPlani] = useState<Plani | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isTeach, setIsTeach] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [userSurname, setUserSurname] = useState<string>('');
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const router = useRouter();


    useEffect(() => {
        const fetchPlanis = async () => {
            const user_id = searchParams.get('id');
            try {
                if (session?.user.rol === "admin") {
                    setIsAdmin(true);
                } else if (session?.user.rol === "teach" || session?.user.rol === "teacher") {
                    setIsTeach(true);
                }
                if (user_id) {
                    const response = await fetch(`/api/planillas?id=${user_id}`);
                    if (!response.ok) {
                        throw new Error('Error obteniendo las planillas del usuario');
                    }
                    const planillas = await response.json();
                    setPlanillasUser(planillas);

                    const responseUser = await fetch(
                        user_id === session?.user.id
                            ? '/api/me'
                            : `/api/usuarios?id=${user_id}`
                    );
                    if (!responseUser.ok) {
                        throw new Error('Error obteniendo el usuario');
                    }
                    const user = await responseUser.json();
                    setUserName(user.nombre);
                    setUserSurname(user.apellido);

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
        bloque: string,
        exerciseIndex: number,
        value: string
    ) => {
        setSelectedPlani((currentPlani) => {
            if (!currentPlani) {
                return currentPlani;
            }

            return updatePlanillaNote(currentPlani, dayIndex, bloque, exerciseIndex, value);
        });
    };

    const handleSaveNote = async (dayIndex: number, bloque: string, exerciseIndex: number) => {
        if (!selectedPlani?._id) {
            alert('No se pudo guardar la nota porque la planilla no tiene ID.');
            return;
        }

        const bloqueKey = bloque as keyof TrainingDay;
        const exercises = selectedPlani.trainingDays[dayIndex]?.[bloqueKey];

        if (!Array.isArray(exercises)) {
            alert('No se pudo identificar el bloque a guardar.');
            return;
        }

        const notas = exercises[exerciseIndex]?.notas ?? '';

        try {
            const response = await fetch(`/api/planillas`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedPlani._id,
                    noteUpdate: {
                        dayIndex,
                        bloque: bloqueKey,
                        exerciseIndex,
                        notas,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar las notas');
            }

            // Actualizar el estado local para que el modal refleje las notas guardadas
            setPlanillasUser((prev) =>
                prev
                    ? prev.map((p) => (p._id === selectedPlani._id ? selectedPlani : p))
                    : prev
            );

            alert('Notas guardadas con éxito');
        } catch (error) {
            console.error(error);
            alert('Hubo un error al guardar las notas: ' + (error instanceof Error ? error.message : 'Error desconocido'));
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
            alert('Error al borrar la planilla');
        }
        alert("Planilla borrada con éxito");
        window.location.reload();
    };

    const handlePrint = () => {
        window.print();
    };



    return (
        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-7 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Link href="/portalAlumnos" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-[#c8e994] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8e994]">
                        <FiArrowLeft aria-hidden="true" /> Volver al portal
                    </Link>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c8e994]">Tu entrenamiento</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Rutinas{userName ? ` de ${userName} ${userSurname}` : session?.user.name ? ` de ${session.user.name}` : ''}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                        Abrí una planilla para consultar ejercicios, series y notas de seguimiento.
                    </p>
                </div>
                {planillasUser && (
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
                        <FiCalendar className="text-[#c8e994]" aria-hidden="true" />
                        <span>{planillasUser.length} {planillasUser.length === 1 ? 'rutina' : 'rutinas'}</span>
                    </div>
                )}
            </div>

            {planillasUser === null ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Cargando rutinas">
                    {[0, 1, 2].map((item) => (
                        <div key={item} className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
                    ))}
                </div>
            ) : planillasUser.length === 0 ? (
                <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-white/10 bg-[#111713] px-6 py-12 text-center sm:px-10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c8e994]/20 bg-[#c8e994]/10 text-[#c8e994]">
                        <FaCalendarAlt className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h2 className="mt-5 text-xl font-semibold text-white">Todavía no hay rutinas</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        Cuando tu profesor prepare una planilla, la vas a encontrar acá.
                    </p>
                    <Link href="/portalAlumnos" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#c8e994] hover:text-[#d9f5ae]">
                        Volver al portal <FiArrowRight aria-hidden="true" />
                    </Link>
                </div>
            ) : (
                <section aria-label="Rutinas disponibles" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {planillasUser.map((plani) => (
                        <article
                            key={plani._id}
                            className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#111713] shadow-[0_18px_50px_-30px_rgba(0,0,0,0.9)] transition duration-300 hover:-translate-y-1 hover:border-[#c8e994]/35 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.95)]"
                        >
                            <button
                                type="button"
                                className="flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c8e994]"
                                onClick={() => handleViewPlanilla(plani)}
                                aria-label={`Abrir rutina de ${plani.month} ${plani.year}`}
                            >
                                <div className="relative flex h-36 items-center justify-between overflow-hidden bg-gradient-to-br from-[#263a2a] via-[#18251b] to-[#101612] px-6">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(200,233,148,0.13),transparent_48%)]" />
                                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/15 p-3 transition-transform duration-300 group-hover:scale-105">
                                        <Image
                                            src="/planilla.png"
                                            alt=""
                                            fill
                                            className="object-contain p-3"
                                            sizes="64px"
                                        />
                                    </div>
                                    <span className="relative rounded-full border border-[#c8e994]/20 bg-black/20 px-3 py-1.5 text-xs font-medium text-[#d7e8c5]">
                                        {plani.trainingDays.length} {plani.trainingDays.length === 1 ? 'día' : 'días'}
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col p-5 sm:p-6">
                                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Plan de entrenamiento</span>
                                    <h2 className="mt-2 text-xl font-semibold capitalize text-white">{plani.month} {plani.year}</h2>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                                        <FiClock className="shrink-0 text-[#c8e994]" aria-hidden="true" />
                                        <span>{formatDate(plani.startDate)} – {formatDate(plani.endDate)}</span>
                                    </div>
                                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#c8e994]">
                                        Ver rutina
                                        <FiArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </span>
                                </div>
                            </button>
                            {(isAdmin || isTeach) && (
                                <div className="flex gap-2 border-t border-white/10 px-5 py-4 sm:px-6">
                                    <button
                                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-rose-300/15 bg-rose-400/10 px-3 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                                        onClick={() => handleDeletePlani(plani._id!, plani.userId)}
                                        aria-label={`Borrar planilla de ${plani.month} ${plani.year}`}
                                    >
                                        <FaTrashAlt className="h-3.5 w-3.5" aria-hidden="true" />
                                        Borrar
                                    </button>
                                    <button
                                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#c8e994]/20 bg-[#c8e994]/10 px-3 py-2 text-sm font-medium text-[#d7f0b2] transition hover:bg-[#c8e994]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8e994]"
                                        onClick={() => router.push('/portalProfes/editPlani?planiID=' + plani._id)}
                                        aria-label={`Editar planilla de ${plani.month} ${plani.year}`}
                                    >
                                        <FaEdit className="h-3.5 w-3.5" aria-hidden="true" />
                                        Editar
                                    </button>
                                </div>
                            )}
                        </article>
                    ))}
                </section>
            )}

            {selectedPlani && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-2 backdrop-blur-sm print:overflow-visible print:static print:bg-white print:bg-opacity-100 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="planilla-title">
                    <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#101612] shadow-2xl print:w-full print:max-w-none print:rounded-none print:border-0 print:shadow-none" id="printable-content">
                        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-[#111713]/95 p-3 backdrop-blur print:hidden sm:gap-4 sm:p-4">
                            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                                <button
                                    onClick={handlePrint}
                                    className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#c8e994] px-3 py-2 text-sm font-semibold text-[#172014] transition hover:bg-[#d7f2aa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8e994] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111713] sm:px-4"
                                    aria-label="Imprimir planilla"
                                >
                                    <FaPrint className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Imprimir</span>
                                </button>
                                <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                                    <button
                                        className="p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c8e994]"
                                        onClick={() => setZoomLevel(z => Math.min(z + 0.1, 2))}
                                        aria-label="Aumentar zoom"
                                    >
                                        <FaSearchPlus className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                    <button
                                        className="border-l border-white/10 p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c8e994]"
                                        onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.7))}
                                        aria-label="Reducir zoom"
                                    >
                                        <FaSearchMinus className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                            <button
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                                onClick={closeModal}
                                aria-label="Cerrar planilla"
                            >
                                <IoCloseCircleSharp className="h-7 w-7" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="p-4 print-content sm:p-7 lg:p-9" style={{ zoom: zoomLevel, transition: 'all 0.2s' }}>
                            <div className="max-w-4xl mx-auto">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c8e994]">Rutina de entrenamiento</p>
                                <h2 id="planilla-title" className="mb-5 mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                    Planilla: {selectedPlani.month} {selectedPlani.year}
                                </h2>
                                <div className="mb-8 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Desde</p>
                                        <p className="mt-1 font-semibold text-slate-200">{formatDate(selectedPlani.startDate)}</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Hasta</p>
                                        <p className="mt-1 font-semibold text-slate-200">{formatDate(selectedPlani.endDate)}</p>
                                    </div>
                                </div>

                                {selectedPlani.trainingDays.map((day, dayIndex) => (
                                    <section key={dayIndex} className="training-day mb-5 overflow-hidden rounded-2xl border border-white/10 bg-[#121a15]">
                                        <h3 className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#18231b] px-4 py-4 text-base font-semibold text-white sm:px-5">
                                            <span>{day.day}</span>
                                            <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1 text-xs font-medium text-slate-400">Día {dayIndex + 1}</span>
                                        </h3>
                                        <div className="space-y-4 p-3 sm:p-5">
                                            {Object.entries(day).map(([bloque, ejercicios]) => (
                                                bloque.startsWith('Bloque') && ejercicios.length > 0 && (
                                                    <div key={bloque} className="rounded-2xl border border-white/[0.08] bg-[#0e1410] p-4 sm:p-5">
                                                        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#d7f0b2]">
                                                            <FaLayerGroup className="text-[#c8e994]" aria-hidden="true" />
                                                            {bloque}
                                                        </h4>
                                                        <ul className="space-y-3">
                                                            {ejercicios.map((exercise: Exercise, exerciseIndex: number) => (
                                                                <li key={exerciseIndex} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 last:border-white/[0.07]">
                                                                    <div className="grid gap-4 text-slate-200">
                                                                        <div className="flex items-start gap-3">
                                                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#c8e994]/10 text-[#c8e994]">
                                                                                <FaDumbbell aria-hidden="true" />
                                                                            </span>
                                                                            <div className="min-w-0">
                                                                                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Ejercicio {exerciseIndex + 1}</p>
                                                                                <p className="mt-1 break-words font-semibold text-white">{exercise.name}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
                                                                            <div className="rounded-xl bg-black/15 px-3 py-2.5">
                                                                                <p className="flex items-center gap-2 text-xs text-slate-500"><FaListOl className="text-[#c8e994]" aria-hidden="true" /> Repeticiones</p>
                                                                                <p className="mt-1 font-semibold text-slate-100">{exercise.reps}</p>
                                                                            </div>
                                                                            <div className="rounded-xl bg-black/15 px-3 py-2.5">
                                                                                <p className="flex items-center gap-2 text-xs text-slate-500"><FaLayerGroup className="text-[#c8e994]" aria-hidden="true" /> Series</p>
                                                                                <p className="mt-1 font-semibold text-slate-100">{exercise.sets}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                                                            <div className="min-w-0 flex-1">
                                                                                <label htmlFor={`exercise-notes-${dayIndex}-${exerciseIndex}`} className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Notas personales</label>
                                                                                <textarea
                                                                                    id={`exercise-notes-${dayIndex}-${exerciseIndex}`}
                                                                                    className="w-full rounded-xl border border-white/10 bg-[#0b100d] px-3 py-2.5 text-sm leading-6 text-slate-100 placeholder-slate-600 transition focus:border-[#c8e994]/50 focus:outline-none focus:ring-2 focus:ring-[#c8e994]/20"
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
                                                                                type="button"
                                                                                onClick={() => handleSaveNote(dayIndex, bloque, exerciseIndex)}
                                                                                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#c8e994]/20 bg-[#c8e994]/10 px-4 py-2 text-sm font-semibold text-[#d7f0b2] transition hover:bg-[#c8e994]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8e994]"
                                                                                aria-label={`Guardar notas de ${exercise.name}`}
                                                                            >
                                                                                <FaSave className="h-4 w-4" aria-hidden="true" /> <span>Guardar</span>
                                                                            </button>
                                                                        </div>
                                                                        
                                                                        {exercise.videoLink && (
                                                                            <div className="mt-1 flex items-center gap-2">
                                                                                <span className="text-sm font-medium text-slate-400">Video del ejercicio</span>
                                                                                <a 
                                                                                    href={exercise.videoLink}
                                                                                    className="inline-flex items-center rounded-lg text-rose-300 transition hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    aria-label="Ver video del ejercicio"
                                                                                >
                                                                                    <ImYoutube2 className="h-7 w-7" />
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
                                    </section>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Planillas;
