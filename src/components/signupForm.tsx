'use client'

import React from "react";
import { useState } from "react";
import { useRouter } from 'next/navigation'

interface FormData {
    nombre: string;
    apellido: string;
    email: string;
    pwd: string;

}

export const SignUpForm = () => {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        nombre: "",
        apellido: "",
        email: "",
        pwd: ""
    })


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await
                fetch('/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.message || "Ha ocurrido un error al registrarte");
                    // Mantener al usuario en la misma página
                } else {
                    alert("Usuario creado correctamente");
                    router.push("/login");
                }
            // Manejar la respuesta del servidor
            const data = await response.json();
            console.log('Datos enviados correctamente:', data);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col justify-center gap-1">
            <label htmlFor="nombre">Nombre</label>
            <input
                type="text"
                id="nombre"
                className="border-slate-500 border rounded-sm p-1"
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />

            <label htmlFor="apellido">Apellido:</label>
            <input
                type="text"
                id="apellido"
                className="border-slate-500 border rounded-sm p-1"
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} />

            <label htmlFor="email">email:</label>
            <input
                type="email"
                id="email"
                className="border-slate-500 border rounded-sm p-1"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <label htmlFor="pwd">Contraseña:</label>
            <input
                type="password"
                id="pwd"
                className="border-slate-500 border rounded-sm p-1"
                onChange={(e) => setFormData({ ...formData, pwd: e.target.value })}
            />

            <button className="bg-green-700 px-4 py-2 text-white font-semibold mt-5">
                Registrarse
            </button>

        </form>
    )
}