
'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoCloseCircleSharp } from 'react-icons/io5';



function NewMetric(
    {
        userID,
        userName,
        // userApellido
    }
        : {
            userID: string,
            userName: string,
            // userApellido:string
        }
) {
    const [selectedNewMetric, setSelectedNewMtric] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        userID: userID,
        date: '',
        weigth: '',
        IMC: '',
        body_fat: '',
        body_musc: '',
        visceral_fat: '',
        body_age: '',
    });
    const handleClick = () => {

        setSelectedNewMtric(true);
        // console.log(userID);
        return;
    };
    const router = useRouter();
    const closeModal = () => {
        setSelectedNewMtric(false);
        router.push(`/portalAlumnos/Metricas?id=${userID}`)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/metricas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    // date: new Date(formData.date),
                }),
            });
        
            if (!response.ok) {
                throw new Error('Error al agregar la métrica');
            }
        
            alert('Métrica agregada con éxito');
            // ... resto del código para limpiar el formulario y cerrar el modal
        } catch (error) {
            console.error('Error al agregar la métrica: ', error);
            alert('Hubo un error al agregar la métrica.');
        }
    };
    return (
        <div>
            <div className="flex justify-end mr-4">
                <button
                    className="bg-blue-600 text-slate-300 px-2 py-1 rounded-sm hover:text-white hover:font-semibold"
                    onClick={handleClick}
                >
                    Agregar medición
                </button>
            </div>
            {selectedNewMetric && (

                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-scroll">
                    <div className="bg-white p-6 rounded shadow-lg w-full mx-1 md:w-3/4 max-w-lg">
                        <div
                            className=' flex justify-end'>
                            <button
                                className="text-white bg-red-500 rounded-md p-1 font-bold text-xl"
                                onClick={closeModal}
                            >
                                <IoCloseCircleSharp className='h-7 w-7' />
                            </button>
                        </div>

                        
                                <div className='my-2'>
                                    Medición de <strong>{userName}</strong>
                                </div>
                                <form onSubmit={handleSubmit} className='flex flex-col justify-center'>
                                    <div className="w-1/2 m-auto my-2">
                                        <label className="block text-sm font-medium text-gray-700 capitalize">
                                            Fecha de Medición:
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="w-1/2 m-auto my-2">
                                        <label className="block text-sm font-medium text-gray-700 capitalize">
                                            Peso:
                                        </label>
                                        <input
                                            type="number"
                                            name="weigth"
                                            value={formData.weigth}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="w-1/2 m-auto my-2">
                                        <label className="block text-sm font-medium text-gray-700 capitalize">
                                            IMC:
                                        </label>
                                        <input
                                            type="number"
                                            name="IMC"
                                            value={formData.IMC}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="w-1/2 m-auto my-2">
                                        <label className="block text-sm font-medium text-gray-700 capitalize">
                                            %Grasa Corporal:
                                        </label>
                                        <input
                                            type="number"
                                            name="body_fat"
                                            value={formData.body_fat}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="w-1/2 m-auto my-2">
                                        <label className="block text-sm font-medium text-gray-700 capitalize">
                                            %Musculo Corporal:
                                        </label>
                                        <input
                                            type="number"
                                            name="body_musc"
                                            value={formData.body_musc}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="w-1/2 m-auto my-2">
                                        <label className="block text-sm font-medium text-gray-700 capitalize">
                                            %Grasa Visceral:
                                        </label>
                                        <input
                                            type="number"
                                            name="visceral_fat"
                                            value={formData.visceral_fat}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="w-1/2 m-auto my-2">
                                        <label className="block text-sm font-medium text-gray-700 capitalize">
                                            Edad Corporal:
                                        </label>
                                        <input
                                            type="number"
                                            name="body_age"
                                            value={formData.body_age}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>


                                    <input type="hidden" name="" value={formData.userID} />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-1/2 m-auto"
                                    >
                                        Guardar
                                    </button>
                                </form>

                            </div>
                        </div>
                    
            )}




        </div >
    )
}

export default NewMetric
