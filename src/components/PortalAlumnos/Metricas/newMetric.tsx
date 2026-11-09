
'use client'

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
            setFormData({
                userID: userID,
                date: '',
                weigth: '',
                IMC: '',
                body_fat: '',
                body_musc: '',
                visceral_fat: '',
                body_age: '',
            });
            setSelectedNewMtric(false);
            router.push(`/portalAlumnos/Metricas?id=${userID}`)
            // ... resto del código para limpiar el formulario y cerrar el modal
        } catch (error) {
            console.error('Error al agregar la métrica: ', error);
            alert('Hubo un error al agregar la métrica.');
        }
    };
    return (
        <div className="flex justify-end">
                <button
                    type="button"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#b9dc75] px-4 py-2.5 text-sm font-semibold text-[#172016] transition hover:bg-[#c9e991] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9dc75]"
                    onClick={handleClick}
                >
                    Agregar medición
                </button>
            {selectedNewMetric && (

                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
                    <div className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111713] p-5 shadow-2xl sm:p-6">
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c8e994]">Nueva medición</p>
                            <h2 className="mt-1 text-xl font-semibold text-white">{userName}</h2>
                          </div>
                            <button
                                type="button"
                                aria-label="Cerrar"
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                                onClick={closeModal}
                            >
                                <IoCloseCircleSharp className="h-7 w-7" />
                            </button>
                        </div>

                                <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-300">
                                            Fecha de Medición:
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-300">
                                            Peso:
                                        </label>
                                        <input
                                            type="number"
                                            name="weigth"
                                            value={formData.weigth}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-300">
                                            IMC:
                                        </label>
                                        <input
                                            type="number"
                                            name="IMC"
                                            value={formData.IMC}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-300">
                                            %Grasa Corporal:
                                        </label>
                                        <input
                                            type="number"
                                            name="body_fat"
                                            value={formData.body_fat}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-300">
                                            %Musculo Corporal:
                                        </label>
                                        <input
                                            type="number"
                                            name="body_musc"
                                            value={formData.body_musc}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-300">
                                            %Grasa Visceral:
                                        </label>
                                        <input
                                            type="number"
                                            name="visceral_fat"
                                            value={formData.visceral_fat}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-300">
                                            Edad Corporal:
                                        </label>
                                        <input
                                            type="number"
                                            name="body_age"
                                            value={formData.body_age}
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-white/10 bg-[#0b0e0c] px-3 py-2.5 text-white outline-none focus:border-[#b9dc75]/50 focus:ring-2 focus:ring-[#b9dc75]/20"
                                            required
                                        />
                                    </div>


                                    <input type="hidden" name="" value={formData.userID} />
                                    <button
                                        type="submit"
                                        className="col-span-full mt-2 min-h-11 rounded-xl bg-[#b9dc75] px-4 py-2.5 text-sm font-semibold text-[#172016] transition hover:bg-[#c9e991]"
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
