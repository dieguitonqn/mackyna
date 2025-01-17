'use client'


import { IReserva } from '@/types/reserva'
import React, { useState } from 'react'


function CellDetail({ reservas, cantidad }: { reservas: IReserva[], cantidad: number }) {
    const [showReservas, setShowReservas] = useState(false)

    return (
        <>
            <div
                className='w-full h-full hover:border-2 hover:border-slate-300'
                onClick={() => setShowReservas(!showReservas)}
            >
                <div className="font-bold mb-2">
                    {cantidad}
                </div>
            </div>

            {showReservas && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div 
                        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Reservas</h3>
                            <button 
                                onClick={() => setShowReservas(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {reservas.map((reserva, index) => (
                            <div 
                                className='p-2 border-b last:border-b-0 text-left'
                                key={index}
                            >
                                {`${reserva?.userInfo?.nombre || ''}, ${reserva?.userInfo?.apellido || ''}`}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default CellDetail
