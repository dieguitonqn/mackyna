'use client';

import React from "react";
import { IConfigs } from "@/types/configs";
import { useState, useEffect } from "react";

export default function Configs() {
    const [configs, setConfigs] = useState<IConfigs>(
        {
            valorClase: 0,
            valorSemana: 0,
            valorQuincena: 0,
            valorTresDias: 0,
            valorCincoDias: 0,
            valorLibre: 0,
            valorDescuento: 0
        }
    );

    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const response = await fetch('/api/configs');
                if (!response.ok) {
                    throw new Error('Error al obtener configuraciones');
                }
                const data: IConfigs = await response.json();
                console.log(data);
                setConfigs(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error(err.message);
                } else {
                    console.error(err);
                }
            }
        };

        fetchConfigs();
    }, []
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/configs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(configs)
            });
            if (!response.ok) {
                alert('Error al guardar configuraciones');
                throw new Error('Error al guardar configuraciones');
            }
            console.log('Configuraciones guardadas');
            alert('Configuraciones guardadas');
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error(err);
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Configuración de Valores de las Clases</h2>

                <div className="mb-4">
                    <label htmlFor="valorClase" className="block text-sm font-medium text-gray-700 mb-1">
                        Valor por Clase:
                    </label>
                    <input
                        type="number"
                        id="valorClase"
                        value={configs.valorClase}
                        onChange={(e) => setConfigs({ ...configs, valorClase: Number(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="valorSemana" className="block text-sm font-medium text-gray-700 mb-1">
                        Valor por Semana:
                    </label>
                    <input
                        type="number"
                        id="valorSemana"
                        value={configs.valorSemana}
                        onChange={(e) => setConfigs({ ...configs, valorSemana: Number(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                                <div className="mb-4">
                    <label htmlFor="valorQuincena" className="block text-sm font-medium text-gray-700 mb-1">
                        Valor por Quincena:
                    </label>
                    <input
                        type="number"
                        id="valorQuincena"
                        value={configs.valorQuincena}
                        onChange={(e) => setConfigs({ ...configs, valorQuincena: Number(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="valor3dias" className="block text-sm font-medium text-gray-700 mb-1">
                        Valor por 3 Días:
                    </label>
                    <input
                        type="number"
                        id="valor3dias"
                        value={configs.valorTresDias}
                        onChange={(e) => setConfigs({ ...configs, valorTresDias: Number(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="valor5dias" className="block text-sm font-medium text-gray-700 mb-1">
                        Valor por 4 ó 5 Días:
                    </label>
                    <input
                        type="number"
                        id="valor5dias"
                        value={configs.valorCincoDias}
                        onChange={(e) => setConfigs({ ...configs, valorCincoDias: Number(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="valorLibre" className="block text-sm font-medium text-gray-700 mb-1">
                        Valor Libre:
                    </label>
                    <input
                        type="number"
                        id="valorLibre"
                        value={configs.valorLibre}
                        onChange={(e) => setConfigs({ ...configs, valorLibre: Number(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="valorDescuento" className="block text-sm font-medium text-gray-700 mb-1">
                        Valor Descuento:
                    </label>
                    <input
                        type="number"
                        id="valorDescuento"
                        value={configs.valorDescuento}
                        onChange={(e) => setConfigs({ ...configs, valorDescuento: Number(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    // onClick={(e) => {
                    //     e.preventDefault();
                    //     // Add save functionality here
                    //     console.log("Configs to save:", configs);
                    // }}
                >
                    Guardar Cambios
                </button>
            </form>
            
        </div>
    );
}