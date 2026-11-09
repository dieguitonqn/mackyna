'use client'

import NewEjercicioForm from '@/components/AddEjercicio';
import EditEjercicioForm from '@/components/EditEjercicioForm';

import React, { useEffect, useState } from 'react'
import { MdOutlineAddChart } from "react-icons/md";

type Ejercicio = {
    _id: string;
    nombre: string;
    grupoMusc?: string;
    specificMusc: string;
    description: string;
    video: string;
};

// const normalizeText = (text: string): string => {
//     return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
// };

const Ejercicios: React.FC = () => {
    const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
    const [filteredEjercicios, setFilteredEjercicios] = useState<Ejercicio[]>([]);
    const [selectedEjercicio, setSelectedEjercicio] = useState<string | null>(null);
    const [selectedNewEjercicio, setSelectedNewEjercicio] = useState<boolean | null>(null);
    const [deletedEjercicio, setDeletedEjercicio] = useState<boolean | null>(null);

    const [filters, setFilters] = useState({
        nombre: '',
        grupoMusc: '',
        specificMusc: '',
        description: '',
        video: '',
    });
    const handleFilterChange = (field: keyof Ejercicio, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/ejercicios');
                if (!response.ok) {
                    throw new Error('Error al obtener usuarios');
                }
                const data: Ejercicio[] = await response.json();
                setEjercicios(data);
                setFilteredEjercicios(data);
            } catch (err: unknown) {
                setError('Error: ' + err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [selectedEjercicio, selectedNewEjercicio, deletedEjercicio]);

    useEffect(() => {
        const normalizeText = (text:string) => 
            text
                .normalize("NFD") // Descompone caracteres acentuados
                .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
                .toLowerCase(); // Convierte a minúsculas
    
        const filtered = ejercicios.filter((ejercicio) =>
            normalizeText(ejercicio.nombre).includes(normalizeText(filters.nombre)) &&
            normalizeText(ejercicio.specificMusc).includes(normalizeText(filters.specificMusc)) &&
            normalizeText(ejercicio.description).includes(normalizeText(filters.description)) &&
            normalizeText(ejercicio.video).includes(normalizeText(filters.video))
        );
        setFilteredEjercicios(filtered);
    }, [filters, ejercicios]);

    const handleEditEjercicio = (_id: string) => {
        setSelectedEjercicio(_id);
    }

    const handleEjercicioClose = () => {
        setSelectedEjercicio(null);
    }



    const handleNewEjercicioClose = () => {
        setSelectedNewEjercicio(null);
    }

    const handleDelete = async (id: string) => {
        try {
            const isConfirmed = window.confirm("¿Estás seguro de que deseas borrar este ejercicio?");
            if (!isConfirmed) {
                return; // Si el usuario cancela, no se procede
            }
            const responseDel = await fetch(`/api/ejercicios?id=${id}`,
                {
                    method: 'DELETE'
                }
            );
            if (!responseDel.ok) {
                throw new Error('Error al borrar el ejercicio');
            }
            setDeletedEjercicio(true);
            alert('Ejercicio borrado con éxito');
            setDeletedEjercicio(false)
        } catch (err: unknown) {
            throw new Error('Error al borrar el ejercicio' + err);
        }

    }

    return (
        <div className="mx-auto w-full max-w-7xl py-2">
            <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b9dc75]">Biblioteca</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Ejercicios</h1>
                    <p className="mt-2 text-sm text-slate-400">Buscá, actualizá y organizá los ejercicios disponibles para las rutinas.</p>
                </div>
                <button
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#b9dc75] px-4 py-2.5 text-sm font-semibold text-[#172016] transition hover:bg-[#c9e991] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9dc75]"
                    onClick={() => setSelectedNewEjercicio(true)}
                >
                    <MdOutlineAddChart className="h-5 w-5" aria-hidden="true" /> Agregar ejercicio
                </button>
            </header>

            {loading && <p className="rounded-2xl border border-white/[0.08] bg-[#111713] p-6 text-center text-sm text-slate-400">Cargando ejercicios...</p>}
            {error && <p className="rounded-2xl border border-rose-300/15 bg-rose-400/[0.07] p-4 text-center text-sm text-rose-200">{error}</p>}

            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111713] shadow-[0_18px_50px_-35px_rgba(0,0,0,0.9)]">
            <div className="overflow-x-auto">
            <table className="portal-profes-table portal-profes-exercises-table min-w-[1100px] w-full border-collapse text-left text-sm">
                <colgroup>
                    <col className="w-[15%]" />
                    <col className="w-[16%]" />
                    <col className="w-[18%]" />
                    <col className="w-[22%]" />
                    <col className="w-[17%]" />
                    <col className="w-[12%]" />
                </colgroup>
                <thead>
                    <tr>
                        <th>
                            <span className="portal-profes-filter-title">Nombre</span>
                            <input
                                type="text"
                                placeholder="Filtrar nombre"
                                value={filters.nombre}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'nombre' as keyof Ejercicio,
                                        e.target.value
                                    )
                                }
                                required
                            />


                        </th>
                        <th>
                            <span className="portal-profes-filter-title">Grupo muscular</span>
                            <input
                                type="text"
                                placeholder="Filtrar grupo"
                                value={filters.grupoMusc}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'grupoMusc' as keyof Ejercicio,
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </th>
                        <th>
                            <span className="portal-profes-filter-title">Músculo específico</span>
                            <input
                                type="text"
                                placeholder="Filtrar músculo"
                                value={filters.specificMusc}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'specificMusc' as keyof Ejercicio,
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </th>
                        <th>
                            <span className="portal-profes-filter-title">Descripción</span>
                            <input
                                type="text"
                                placeholder="Filtrar descripción"
                                value={filters.description}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'description' as keyof Ejercicio,
                                        e.target.value
                                    )
                                }
                            />

                        </th>
                        <th>
                            <span className="portal-profes-filter-title">Video</span>
                            <input
                                type="text"
                                placeholder="Filtrar video"
                                value={filters.video}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'video' as keyof Ejercicio,
                                        e.target.value
                                    )
                                }
                            />

                        </th>
                        <th>
                            <span className="portal-profes-filter-title">Acciones</span>
                            <span className="portal-profes-filter-spacer" aria-hidden="true" />
                        </th>

                    </tr>
                </thead>
                <tbody>
                    {filteredEjercicios.map((ejercicio, index) => (
                        <tr
                            key={index}
                            className="text-slate-300"
                        >
                            <td>{ejercicio.nombre}</td>
                            <td>{ejercicio.grupoMusc}</td>
                            <td>{ejercicio.specificMusc}</td>
                            <td>{ejercicio.description}</td>
                            <td>
                                {ejercicio.video ? (
                                    <a href={ejercicio.video} target="_blank" rel="noopener noreferrer" className="font-medium text-[#c8e994] hover:text-[#e0f5c2] hover:underline">
                                        Ver Video
                                    </a>
                                ) : (
                                    ""
                                )}
                            </td>

                            <td className="px-3 py-3">
                                <div className="flex min-w-[120px] flex-col gap-2">
                                <button
                                    className="w-full rounded-lg border border-[#b9dc75]/20 bg-[#b9dc75]/[0.1] px-3 py-2 text-xs font-medium text-[#d5ecb7] transition hover:bg-[#b9dc75]/[0.18]"
                                    onClick={() => handleEditEjercicio(ejercicio._id)}
                                >
                                    Editar
                                </button>
                                <button className="w-full rounded-lg border border-rose-300/15 bg-rose-400/[0.08] px-3 py-2 text-xs font-medium text-rose-200 transition hover:bg-rose-400/[0.16]"
                                    onClick={() => handleDelete(ejercicio._id)}>
                                    Borrar
                                </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {!filteredEjercicios.length && !loading && !error && (
                        <tr>
                            <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                                No encontramos ejercicios con esos filtros.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
            </div>
            {selectedEjercicio && (
                <EditEjercicioForm _id={selectedEjercicio} onClose={handleEjercicioClose} />
            )}
            {selectedNewEjercicio && (
                <NewEjercicioForm onClose={handleNewEjercicioClose} />
            )}
        </div>
    )
}

export default Ejercicios
