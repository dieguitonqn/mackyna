'use client'
import CardInit from '@/components/PortalAlumnos/cardInit'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { FiAlertTriangle } from "react-icons/fi"
import BirthdayModal from '@/components/PortalAlumnos/BirthdayModal'
import Link from 'next/link'

function Page() {
    const { data: session, status } = useSession();
    const [showBirthdayModal, setShowBirthdayModal] = useState(false);

    useEffect(() => {
        const checkBirthday = async () => {
            if (session?.user?.email) {
                try {
                    const response = await fetch('/api/me');
                    const userData = await response.json();
                    console.log('User Data:', userData);
                    if (userData?.fecha_nacimiento) {
                        const birthDate = new Date(userData.fecha_nacimiento);
                        const today = new Date();
                        console.log('Birth Date:', birthDate);
                        console.log('Today:', today);
                        
                        if (birthDate.getDate()+1 === today.getDate() && 
                            birthDate.getMonth() === today.getMonth()) {
                            setShowBirthdayModal(true);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        checkBirthday();
    }, [session]);

    if (status === 'loading') {
        return (
            <main className="mx-auto flex min-h-[65vh] w-full max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
                <div className="animate-pulse space-y-5" aria-label="Cargando portal de alumnos" role="status">
                    <div className="mx-auto h-4 w-36 rounded-full bg-white/10" />
                    <div className="mx-auto h-10 w-72 max-w-full rounded-xl bg-white/10" />
                    <div className="mx-auto mt-12 grid w-full grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="h-80 rounded-3xl border border-white/10 bg-white/[0.03]" />
                        <div className="h-80 rounded-3xl border border-white/10 bg-white/[0.03]" />
                    </div>
                </div>
            </main>
        )
    }

    if (!session) {
        return (
            <main className="flex min-h-[65vh] items-center justify-center px-4 py-16">
                <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111713] p-8 text-center shadow-2xl">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10">
                        <FiAlertTriangle className="h-7 w-7 text-amber-200" aria-hidden="true" />
                    </div>
                    <h1 className="mt-5 text-xl font-semibold text-white">Acceso restringido</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Iniciá sesión para consultar tus rutinas y mediciones.</p>
                    <Link
                        href="/login"
                        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#c8e994] px-5 py-2.5 text-sm font-semibold text-[#172014] transition hover:bg-[#d7f2aa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8e994] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111713]"
                    >
                        Ir a iniciar sesión
                    </Link>
                </div>
            </main>
        )
    }

    const firstName = session.user.name?.trim().split(/\s+/)[0];

    return (
        <main className="mx-auto min-h-[70vh] w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c8e994]">Tu espacio Mackyna</p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                    {firstName ? `Hola, ${firstName}` : 'Portal de alumnos'}
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
                    Consultá tus rutinas de entrenamiento y seguí la evolución de tus mediciones en un solo lugar.
                </p>
            </header>

            <section aria-label="Herramientas para alumnos" className="grid grid-cols-1 justify-items-center gap-5 md:grid-cols-2 md:gap-6">
                <CardInit
                    imagen='/planillas.png'
                    titulo='Rutinas de entrenamiento'
                    desc="Encontrá tus planes, ejercicios y notas de seguimiento."
                    link='/portalAlumnos/Planilla'
                />
                <CardInit
                    imagen='/mediciones.png'
                    titulo='Mediciones corporales'
                    desc="Revisá tus registros y observá cómo evoluciona tu progreso."
                    link='/portalAlumnos/Metricas'
                />
            </section>

            {showBirthdayModal && (
                <BirthdayModal
                    userName={session.user.name || 'Usuario'}
                    onClose={() => setShowBirthdayModal(false)}
                />
            )}
        </main>
    )
}

export default Page
