'use client'

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Script from "next/script";
// import { Turnstile } from "next-turnstile";

interface FormData {
    nombre: string;
    apellido: string;
    email: string;
    pwd: string;
    token: string;
}

export const SignUpForm = () => {

    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        nombre: "",
        apellido: "",
        email: "",
        pwd: "",
        token: "",
    });
    // const [turnstileStatus, setTurnstileStatus] = useState<
    //     "success" | "error" | "expired" | "required"
    // >("required");
    // const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // setError(null);
        setIsLoading(true);
        try {
            // console.log(formData);
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message || "Ha ocurrido un error al registrarte");
            } else {
                alert("Usuario creado correctamente");
                router.push("/login");
            }

            const data = await response.json();
            console.log('Datos enviados correctamente:', data);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <>
            <Script
                id="Turnstile"
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                async

                defer>
            </Script>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-1">
                <label htmlFor="nombre">Nombre</label>
                <input
                    type="text"
                    id="nombre"
                    className="border-slate-500 border rounded-sm p-1"
                    onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                />

                <label htmlFor="apellido">Apellido:</label>
                <input
                    type="text"
                    id="apellido"
                    className="border-slate-500 border rounded-sm p-1"
                    onChange={(e) => setFormData((prev) => ({ ...prev, apellido: e.target.value }))}
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    className="border-slate-500 border rounded-sm p-1"
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />

                <label htmlFor="pwd">Contraseña:</label>
                <input
                    type="password"
                    id="pwd"
                    className="border-slate-500 border rounded-sm p-1"
                    onChange={(e) => setFormData((prev) => ({ ...prev, pwd: e.target.value }))}
                />

                {/* <div className="mt-6"> */}
                <div
                    className="cf-turnstile"
                    data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    data-callback="javascriptCallback"

                ></div>
                {/* <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    retry="auto"
                    refreshExpired="auto"
                    theme="light"
                    // onError={() => {
                    //     setTurnstileStatus("error");
                    //     setError("Security check failed. Please try again.");
                    // }}
                    // onExpire={() => {
                    //     setTurnstileStatus("expired");
                    //     setError("Security check expired. Please verify again.");
                    // }}
                    // onLoad={() => {
                    //     setTurnstileStatus("required");
                    //     setError(null);
                    // }}
                    onVerify={(token) => {
                        // setTurnstileStatus("success");
                        // setError(null);
                        setFormData((prev) => ({ ...prev, token }));
                    }}
                    
                /> */}
                {/* </div> */}
                <button className="bg-green-700 px-4 py-2 text-white font-semibold mt-5" disabled={isLoading}>
                    {isLoading ? "Registrando..." : "Registrarse"}
                </button>
            </form>
        </>
    );
};
