import React from 'react';

export const Condiciones = () => {
    return (
        <div className='card bg-white rounded-lg shadow-md p-6 my-5 flex flex-col gap-3 w-full md:w-1/4 justify-center items-center mx-auto'>
            <h1 className='text-2xl font-semibold'>Condiciones para la cancelación de reservas</h1>
            <ul className='list-disc list-inside'>
                <li>
                    Las reservas solo pueden cancelarse con más de 30 minutos de anticipación.
                </li>
                <li>
                    No se pueden cancelar reservas de días anteriores.
                </li>
                <li>
                    Las reservas de días futuros pueden cancelarse en cualquier momento.
                </li>
                <li>
                    Las reservas pasadas solo pueden cancelarse los viernes a partir de las 20:00 horas.
                </li>
            </ul>
        </div>
    )
}

