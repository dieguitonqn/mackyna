'use client'


import { IReserva } from '@/types/reserva'
import { IUser } from '@/types/user';
import React, { use, useState } from 'react'
 import { FiPlus, FiTrash2 } from 'react-icons/fi'
 import AutoCompleteInput from '@/components/AutocompleteUsers';
 import { useEffect } from 'react';



function CellDetail({ reservas, dia, hora,cantidad }: { reservas: IReserva[],dia:string, hora:string, cantidad: number }) {
    const [showReservas, setShowReservas] = useState(false);
    const [users, setUsers] = useState<IUser[] | null>(null);
    const [showAddReserva, setShowAddReserva] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [turnoId, setTurnoId] = useState<string>('');



    const handleAddReserva = async () => {
        try {
            const response = await fetch("/api/usuarios");
            const usersDB = await response.json();
            const usersWithStringId = usersDB.map((user: IUser) => ({
                ...user,
                id: user._id.toString(),
            }));
            setUsers(usersWithStringId);
            setShowAddReserva(true);
        } catch (err) {
            console.error("Error al obtener usuarios:", err);
        }
        try {
                const response = await fetch(`/api/turnos?dia=${dia}&hora=${hora}`);
                if (!response.ok) {
                    throw new Error('Error al obtener turnos');
                }
                const turnos = await response.json();
                console.log('Turnos obtenidos:', turnos);
                if (turnos && turnos._id) {
                    console.log('Turno ID:', turnos._id);
                    setTurnoId(turnos._id.toString());
                } else {
                    console.error('No se encontraron turnos para el día y hora especificados');
                    setTurnoId('');
                }
            } catch (error) {
                console.error('Error al obtener turnos:', error);
                setTurnoId('');
            }
    };

    const handleSelectUser = (user: IUser) => {
        setSelectedUser(user);
    };

    const handleConfirmReserva = async () => {
        if (!selectedUser) return;
        try {
            const response = await fetch('/api/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ turnoID: turnoId, userID: selectedUser._id })
            });
            if (response.ok) {
                alert('Reserva creada correctamente');
                setShowAddReserva(false);
                setSelectedUser(null);
            } else {
                let errorMessage = 'Error desconocido';
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorJson = await response.json();
                    errorMessage = errorJson.mensaje || errorMessage;
                } else {
                    errorMessage = await response.text();
                }
                alert('Error al crear la reserva: ' + errorMessage);
            }
        } catch (err) {
            alert('Error al crear la reserva');
        }
    };

    const handleDeleteReserva = async(turnoId: string, userId:string) => {
        // Aquí puedes implementar la lógica para eliminar una reserva
        console.log(`Eliminar reserva con ID: ${turnoId} para el usuario con ID: ${userId}`);
        try {
            const response = await fetch(`/api/reservas`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ turnoID: turnoId, userID: userId })
        });
        if (response.ok) {
            alert('Reserva cancelada correctamente');
            // router.refresh();
        }else {
            const errorMessage = await response.json();
            alert('Error al cancelar la reserva: ' + errorMessage.mensaje || 'Error desconocido');
        }
        // alert('Reserva cancelada correctamente');
        } catch (error:unknown) {
            console.error("Error al eliminar la reserva:", error);  
            
            
        }
    };
    return (
        <>
            <div
            className='w-full h-full flex items-center justify-center cursor-pointer transition-colors duration-150'
            onClick={() => setShowReservas(!showReservas)}
            >
            <div className="font-bold text-lg text-gray-900">
                {cantidad}
            </div>
            </div>

            {showReservas && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div
                className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto text-white"
                onClick={(e) => e.stopPropagation()}
                >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-green-600">Detalle de Reservas</h3>
                    <button
                    onClick={() => setShowReservas(false)}
                    className="text-gray-400 hover:text-sky-400 transition-colors text-2xl"
                    >
                    &times;
                    </button>
                </div>

                {reservas.length > 0 ? (
                    reservas.map((reserva, index) => (
                    <div
                        className='p-3 bg-gray-700 rounded-md mb-3 shadow-md hover:bg-gray-600 transition-colors'
                        key={index}
                    >
                        <div className="flex justify-between items-center">
                        <span className="text-gray-200 text-sm">{`${reserva?.userInfo?.nombre || 'Usuario'} ${reserva?.userInfo?.apellido || 'Desconocido'}`}</span>
                        <button className='ml-4 p-2 bg-red-800 text-white rounded-full hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                            onClick={() => handleDeleteReserva(reserva.turnoInfo.turnoId, reserva.userInfo.userId)}
                            aria-label="Eliminar reserva"
                        >
                            <FiTrash2 className="h-4 w-4" />
                        </button>
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center py-4">No hay reservas para mostrar.</p>
                )}

                <button
                    className='mt-6 w-full flex items-center justify-center px-4 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50'
                    onClick={() => { handleAddReserva() }} // Added optional chaining and default value
                    // disabled={!reservas || reservas.length === 0} // Disable if no reservas
                >
                    <FiPlus className="mr-2 h-5 w-5" />
                    Agregar Nueva Reserva
                </button>

                {showAddReserva && users && (
                    <div className="mt-6 p-4 border border-gray-700 rounded-lg bg-gray-750 shadow">
                    <div className="mb-3 font-semibold text-emerald-500">Seleccionar usuario para agregar:</div>
                    <AutoCompleteInput
                        users={users}
                        onSelect={handleSelectUser}
                    />
                    {selectedUser && (
                        <div className="mt-4 flex flex-col gap-3">
                        <div className="text-sm text-gray-300">
                            Usuario seleccionado: <span className="font-bold text-sky-300">{selectedUser.nombre} {selectedUser.apellido}</span>
                        </div>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            onClick={() => handleConfirmReserva()} // Added optional chaining and default value
                            // disabled={!reservas || reservas.length === 0} // Disable if no reservas
                        >
                            Confirmar Reserva
                        </button>
                        </div>
                    )}
                    </div>
                )}
                </div>
            </div>
            )}
        </>
    )
}

export default CellDetail
