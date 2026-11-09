'use client'

import React from "react";
import { Medicion } from "@/types/metrics"; // Asegúrate de tener esta ruta correcta
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateOnlyEs, toDateInputValue } from "@/utils/dateOnly";

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
        setEditedItem({
            ...item,
            date: toDateInputValue(item.date),
        });
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
    const canManageMetrics = ["admin", "teach", "teacher"].includes(session?.user?.rol ?? "");
    return (
        <section className="my-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111713] shadow-[0_18px_50px_-35px_rgba(0,0,0,0.9)]">
          <div className="border-b border-white/[0.07] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c8e994]">Historial</p>
            <h2 className="mt-1 text-lg font-semibold text-white">Mediciones registradas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm text-slate-300">
                <thead className="bg-[#172019] text-xs uppercase tracking-wide text-slate-300">
                    <tr>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Peso</th>
                        <th className="px-4 py-3">IMC</th>
                        <th className="px-4 py-3">% Grasa corporal</th>
                        <th className="px-4 py-3">% Masa muscular</th>
                        <th className="px-4 py-3">% Grasa visceral</th>
                        <th className="px-4 py-3">Edad corporal</th>
                        {canManageMetrics && (
                            <th className="px-4 py-3 text-center">Acciones</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.slice().reverse().map((item) => (
                        <tr key={item._id} className="border-t border-white/[0.06] transition hover:bg-white/[0.035]">
                            <td className="whitespace-nowrap px-4 py-3">{formatDateOnlyEs(item.date, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td className="px-4 py-3">{item.weigth} kg</td>
                            <td className="px-4 py-3">{item.IMC}</td>
                            <td className="px-4 py-3">{item.body_fat}%</td>
                            <td className="px-4 py-3">{item.body_musc}%</td>
                            <td className="px-4 py-3">{item.visceral_fat}%</td>
                            <td className="px-4 py-3">{item.body_age} años</td>
                            {canManageMetrics && <td className="px-4 py-3">
                              <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="rounded-lg border border-[#b9dc75]/20 bg-[#b9dc75]/[0.1] px-3 py-2 text-xs font-medium text-[#d5ecb7] transition hover:bg-[#b9dc75]/[0.18]"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onDelete(item._id)}
                                        className="rounded-lg border border-rose-300/15 bg-rose-400/[0.08] px-3 py-2 text-xs font-medium text-rose-200 transition hover:bg-rose-400/[0.16]"
                                    >
                                        Borrar
                                    </button>
                              </div>
                            </td>}
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>

            {edit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
                    <div className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111713] p-5 shadow-2xl sm:p-6">
                        <h2 className="mb-5 text-xl font-semibold text-white">Editar medición</h2>
                        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="date" className="mb-1 block text-sm font-medium text-slate-300">Fecha</label>
                                <input
                                    id="date"
                                    type="date"
                                    placeholder="fecha"
                                    className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                    value={toDateInputValue(editedItem?.date)}
                                    onChange={(e) => handleInputChange(e)} />
                            </div>
                            <div>
                                <label htmlFor="weigth" className="mb-1 block text-sm font-medium text-slate-300">Peso</label>
                                <input
                                    id="weigth"
                                    type="text"
                                    placeholder="Peso"
                                    className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                    value={editedItem?.weigth}
                                    onChange={(e) => handleInputChange(e)} />
                            </div>

                            <div>
                                <label htmlFor="IMC" className="mb-1 block text-sm font-medium text-slate-300">IMC</label>
                                <input
                                    id="IMC"
                                    type="text"
                                    placeholder="IMC"
                                    className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                    value={editedItem?.IMC}
                                    onChange={(e) => handleInputChange(e)} />

                            </div>
                            <div>
                                <label htmlFor="body_fat" className="mb-1 block text-sm font-medium text-slate-300">% Grasa corporal</label>
                                <input
                                    id="body_fat"
                                    type="text"
                                    placeholder="% Grasa Corporal"
                                    className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                    value={editedItem?.body_fat}
                                    onChange={(e) => handleInputChange(e)} />
                            </div>

                            <div>
                                <label htmlFor="body_musc" className="mb-1 block text-sm font-medium text-slate-300">% Músculo corporal</label>
                                <input
                                    id="body_musc"
                                    type="text"
                                    placeholder="% Músculo corporal "
                                    className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                    value={editedItem?.body_musc}
                                    onChange={(e) => handleInputChange(e)} />
                            </div>

                            <div>
                                <label htmlFor="visceral_fat" className="mb-1 block text-sm font-medium text-slate-300">% Grasa visceral</label>
                                <input id="visceral_fat"
                                    type="text"
                                    placeholder="% Grasa Visceral"
                                    className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                    value={editedItem?.visceral_fat}
                                    onChange={(e) => handleInputChange(e)} />
                            </div>
                            <div>
                                <label htmlFor="body_age" className="mb-1 block text-sm font-medium text-slate-300">Edad corporal</label>
                                <input id="body_age"
                                    type="text"
                                    placeholder="Edad Corporal"
                                    className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                    value={editedItem?.body_age}
                                    onChange={(e) => handleInputChange(e)} />
                            </div>

                            <div className="col-span-full flex justify-end gap-3 pt-2">
                                <button type="submit" className="rounded-xl bg-[#b9dc75] px-4 py-2.5 text-sm font-semibold text-[#172016] transition hover:bg-[#c9e991]">
                                    Guardar
                                </button>
                                <button type="button" onClick={() => setEdit(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]">
                                    Cancelar
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MetricsTable;
