'use client'

import React from "react";
import { Medicion } from "@/types/metrics"; // Asegúrate de tener esta ruta correcta
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    data: Medicion[];

}

const MetricsTable: React.FC<Props> = ({ data }) => {

    const [edit, setEdit] = useState(false);
    const [deleteItem, setDeleteItem] = useState(false);
    const [editedItem, setEditedItem] = useState<Medicion>({
        _id: "",
        userID: "",
        date: "",
        weigth: 0,
        IMC: 0,
        body_fat: 0,
        body_musc: 0,
        visceral_fat: 0,
        body_age: 0,
    });
    const router = useRouter();

    function onEdit(item: Medicion) {
        setEdit(true);
        setEditedItem(item);
        return
    }
    async function onDelete(key: string) {
        setDeleteItem(true);
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta métrica?")) {
            return
        }
        try {
            const res = await fetch(`/api/metricas?id=${key}`, {
                method: "DELETE",
            })
            if (res.ok) {
                alert("Métrica eliminada correctamente");
                router.refresh();
            } else {
                alert("Hubo un error al eliminar la métrica");
            }
        } catch (error:unknown) {
            console.error("Error:", error);
            
        }
        console.log(key);
        console.log(deleteItem)

    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setEditedItem({ ...editedItem, [id]: value });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/metricas", {
                method: "PUT",
                body: JSON.stringify(editedItem),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.ok) {
                setEdit(false);
                alert("Métrica editada correctamente");
                router.refresh();

            } else {
                alert("Hubo un error al editar la métrica");
            }
        } catch (error: unknown) {
            console.error("Error:", error);
        }
    }


    const { data: session } = useSession();
    return (
        <div className="overflow-x-auto md:flex justify-center  my-10">
            <table className="w-10/12 bg-gray-800 text-white border border-gray-700 rounded-lg text-center">
                <thead>
                    <tr className="bg-gray-900 text-left">
                        <th className="py-2 px-4">Fecha</th>
                        <th className="py-2 px-4">Peso</th>
                        <th className="py-2 px-4">IMC</th>
                        <th className="py-2 px-4">% Grasa Corporal</th>
                        <th className="py-2 px-4">% Masa Muscular</th>
                        <th className="py-2 px-4">% Grasa Visceral</th>
                        <th className="py-2 px-4">Edad Corporal</th>
                        {(session?.user.rol == "admin" || session?.user.rol == "teach") && (
                            <th className="py-2 px-4 text-center">Acciones</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.slice().reverse().map((item) => (
                        <tr key={item._id} className="even:bg-gray-700 hover:bg-gray-600">
                            <td className="py-2 px-4">{item.date}</td>
                            <td className="py-2 px-4">{item.weigth} kg</td>
                            <td className="py-2 px-4">{item.IMC}</td>
                            <td className="py-2 px-4">{item.body_fat}%</td>
                            <td className="py-2 px-4">{item.body_musc}%</td>
                            <td className="py-2 px-4">{item.visceral_fat}%</td>
                            <td className="py-2 px-4">{item.body_age} años</td>
                            <td className="py-2 px-4 flex justify-center space-x-4">
                                {(session?.user.rol == "admin" || session?.user.rol == "teach") && (
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                                    >
                                        Editar
                                    </button>)}
                                {(session?.user.rol == "admin" || session?.user.rol == "teach") && (
                                    <button
                                        onClick={() => onDelete(item._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                                    >
                                        Borrar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {edit && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex   items-center justify-center">
                    <div className="bg-white p-4 rounded-lg ">
                        <h2 className="text-xl font-bold">Editar métrica</h2>
                        <form onSubmit={handleSubmit} className="flex-col flex text-right">
                            <div>
                                <label htmlFor="date">Fecha:</label>
                                <input
                                    id="date"
                                    type="text"
                                    placeholder="fecha"
                                    className="p-1 border border-slate-200 m-2 rounded-sm"
                                    value={editedItem?.date}
                                    onChange={(e) => handleInputChange(e)} />
                            </div>
                            <div>
                                <label htmlFor="weigth">Peso:</label>
                                <input
                                    id="weigth"
                                    type="text"
                                    placeholder="Peso"
                                    className="p-1 border border-slate-200 m-2 rounded-sm"
                                    value={editedItem?.weigth}
                                    onChange={(e) => handleInputChange(e)} />
                            </div>

                            <div>
                                <label htmlFor="peso">IMC:</label>
                                <input
                                    id="IMC"
                                    type="text"
                                    placeholder="IMC"
                                    className="p-1 border border-slate-200 m-2 rounded-sm"
                                    value={editedItem?.IMC}
                                    onChange={(e) => handleInputChange(e)} />

                            </div>
                            <div>
                                <label htmlFor="body_fat">% Grasa Corporal:</label>
                                <input
                                    id="body_fat"
                                    type="text"
                                    placeholder="% Grasa Corporal"
                                    className="p-1 border border-slate-200 m-2 rounded-sm"
                                    value={editedItem?.body_fat}
                                    onChange={(e) => handleInputChange(e)} />
                            </div>

                            <div>
                                <label htmlFor="body_musc">% Músculo corporal:</label>
                                <input
                                    id="body_musc"
                                    type="text"
                                    placeholder="% Músculo corporal "
                                    className="p-1 border border-slate-200 m-2 rounded-sm"
                                    value={editedItem?.body_musc}
                                    onChange={(e) => handleInputChange(e)} />
                            </div>

                            <div>
                                <label htmlFor="visceral_fat">% Grasa Visceral:</label>
                                <input id="visceral_fat"
                                    type="text"
                                    placeholder="% Grasa Visceral"
                                    className="p-1 border border-slate-200 m-2 rounded-sm"
                                    value={editedItem?.visceral_fat}
                                    onChange={(e) => handleInputChange(e)} />
                            </div>
                            <div>
                                <label htmlFor="body_age">Edad Corporal:</label>
                                <input id="body_age"
                                    type="text"
                                    placeholder="Edad Corporal"
                                    className="p-1 border border-slate-200 m-2 rounded-sm"
                                    value={editedItem?.body_age}
                                    onChange={(e) => handleInputChange(e)} />
                            </div>

                            <div>
                                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded w-1/2 m-auto">
                                    Guardar
                                </button>
                                <button onClick={() => setEdit(false)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded w-1/2 m-auto">
                                    Cancelar
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetricsTable;
