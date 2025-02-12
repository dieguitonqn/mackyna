import React from 'react';

export const Condiciones = () => {
    return (
        <div className='max-w-2xl mx-auto my-8 p-8 bg-white rounded-xl shadow-lg'>
            <h1 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
            Condiciones para la cancelación de reservas
            </h1>
            <div className='space-y-4'>
            {[
                'Las reservas solo pueden cancelarse con más de 30 minutos de anticipación.',
                'No se pueden cancelar reservas de días anteriores.',
                'Las reservas de días futuros pueden cancelarse en cualquier momento.',
                'Las reservas pasadas solo pueden cancelarse los viernes a partir de las 20:00 horas.'
            ].map((condition, index) => (
                <div key={index} className='flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
                <span className='text-blue-500 mt-1'>•</span>
                <p className='text-gray-700'>{condition}</p>
                </div>
            ))}
            </div>
        </div>
    )
}

