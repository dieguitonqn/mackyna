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
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6 text-center shadow-lg w-auto">Lista de Ejercicios</h1>

            {loading && <p className="text-center">Cargando ejercicios...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className='flex justify-end'>
                <button
                    className='bg-green-500 px-1 py-2 rounded-md m-2 gap-1 flex flex-row items-center hover:font-semibold'
                    onClick={() => setSelectedNewEjercicio(true)}
                >
                    <MdOutlineAddChart className='w-6 h-6' /> Agregar Ejercicio
                </button>
            </div>
            <table className="table-auto w-full border-collapse border border-gray-200 text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th
                            className="border border-gray-300 px-2 py-2 text-left text-gray-600"
                        >
                            Nombre
                            <input
                                type="text"
                                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder={`Filtrar por Nombre`}
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
                        {/* <th
                            className="border border-gray-300 px-2 py-2 text-left text-gray-600"
                        >
                            Grupo Muscular
                            <input
                                type="text"
                                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder={`Filtrar por Grupo Muscular`}
                                value={filters.grupoMusc}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'grupoMusc' as keyof Ejercicio,
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </th> */}
                        <th
                            className="border border-gray-300 px-2 py-2 text-left text-gray-600"
                        >
                            Músculo Específico
                            <input
                                type="text"
                                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder={`Filtrar por Músculo Específico`}
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
                        <th
                            className="border border-gray-300 px-2 py-2 text-left text-gray-600"
                        >
                            Descripción
                            <input
                                type="text"
                                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder={`Filtrar por Descripción`}
                                value={filters.description}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'description' as keyof Ejercicio,
                                        e.target.value
                                    )
                                }
                            />

                        </th>
                        <th
                            className="border border-gray-300 px-2 py-2 text-left text-gray-600"
                        >
                            Video
                            <input
                                type="text"
                                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder={`Filtrar por Video`}
                                value={filters.video}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'video' as keyof Ejercicio,
                                        e.target.value
                                    )
                                }
                            />

                        </th>
                        <th
                            className="border border-gray-300 px-2 py-2 text-left text-gray-600"
                        >
                            Acciones
                        </th>

                    </tr>
                </thead>
                <tbody>
                    {filteredEjercicios.map((ejercicio, index) => (
                        <tr
                            key={index}
                            className="hover:bg-gray-200 border "
                        >
                            <td className="px-2 py-2 border">{ejercicio.nombre}</td>
                            {/* <td className="px-2 py-2 border">{ejercicio.grupoMusc}</td> */}
                            <td className="px-2 py-2 border">{ejercicio.specificMusc}</td>
                            <td className="px-2 py-2 border">{ejercicio.description}</td>
                            <td className="px-2 py-2 border">
                                {ejercicio.video ? (
                                    <a href={ejercicio.video} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        Ver Video
                                    </a>
                                ) : (
                                    ""
                                )}
                            </td>

                            <td className="px-2 py-2 flex flex-col gap-1 items-center">
                                <button
                                    className="w-full px-2 py-1 bg-green-600 text-white rounded-sm text-sm"
                                    onClick={() => handleEditEjercicio(ejercicio._id)}
                                >
                                    Editar
                                </button>
                                <button className="w-full px-2 py-1 bg-red-600 text-white rounded-sm text-sm"
                                    onClick={() => handleDelete(ejercicio._id)}>
                                    Borrar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
