'use client';

import React, { use } from "react";
import { IConfigs } from "@/types/configs";
import { useState, useEffect } from "react";

export default function Configs() {
    const [configs, setConfigs] = useState<IConfigs>(
        {
            valorClase: 0,
            valorDia: 0,
            valor4dias: 0,
            valor5dias: 0,
            valorLibre: 0
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
                throw new Error('Error al guardar configuraciones');
            }
            console.log('Configuraciones guardadas');
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
                <h2 className="text-xl font-semibold mb-4">Configuración de Valores</h2>

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
                    <label htmlFor="valorDia" className="block text-sm font-medium text-gray-700 mb-1">
                        Valor por Día:
                    </label>
                    <input
                        type="number"
                        id="valorDia"
                        value={configs.valorDia}
                        onChange={(e) => setConfigs({ ...configs, valorDia: Number(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="valor4dias" className="block text-sm font-medium text-gray-700 mb-1">
                        Valor por 4 Días:
                    </label>
                    <input
                        type="number"
                        id="valor4dias"
                        value={configs.valor4dias}
                        onChange={(e) => setConfigs({ ...configs, valor4dias: Number(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="valor5dias" className="block text-sm font-medium text-gray-700 mb-1">
                        Valor por 5 Días:
                    </label>
                    <input
                        type="number"
                        id="valor5dias"
                        value={configs.valor5dias}
                        onChange={(e) => setConfigs({ ...configs, valor5dias: Number(e.target.value) })}
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

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    onClick={(e) => {
                        e.preventDefault();
                        // Add save functionality here
                        console.log("Configs to save:", configs);
                    }}
                >
                    Guardar Cambios
                </button>
            </form>
            <h1>Configs</h1>
        </div>
    );
}