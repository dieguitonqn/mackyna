'use client'
import CardInit from '@/components/PortalAlumnos/cardInit'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { FiAlertTriangle } from "react-icons/fi"
import BirthdayModal from '@/components/PortalAlumnos/BirthdayModal'

function Page() {
    const { data: session } = useSession();
    const [showBirthdayModal, setShowBirthdayModal] = useState(false);

    useEffect(() => {
        const checkBirthday = async () => {
            if (session?.user?.email) {
                try {
                    const response = await fetch(`/api/usuarios?id=${session.user.id}`);
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

    if (session) {
        return (
            <div className='flex flex-col justify-center items-center min-h-screen mb-10'>
                <div className='text-6xl text-slate-300 font-semibold justify-center text-center my-10'>
                    Portal de Alumnos
                </div>
                <div className='flex flex-wrap gap-16 justify-center items-center '>
                    <CardInit
                        imagen='/planillas.png'
                        titulo='Rutinas de entrenamiento'
                        desc="Todas las rutinas de entrenamiento"
                        link='/portalAlumnos/Planilla'
                    />
                    <CardInit
                        imagen='/mediciones.png'
                        titulo='Mediciones corporales'
                        desc="Todas las mediciones realizadas en Mackyna"
                        link='/portalAlumnos/Metricas'
                    />
                    <CardInit
                        imagen='/turnos.png'
                        titulo='Turnos'
                        desc='Días y horarios en que asistirá. También podrá agendar nuevos turnos o editar los que ya tenga.'
                        link='/portalAlumnos/Turnos'
                    />
                    <CardInit 
                        imagen='/pagos.png'
                        titulo='Pagos'
                        desc="Realizar pagos de cuotas (Solo Mercado Pago)"
                        link='/portalAlumnos/Pago'
                    />
                </div>

                {showBirthdayModal && (
                    <BirthdayModal
                        userName={session.user.name || 'Usuario'}
                        onClose={() => setShowBirthdayModal(false)}
                    />
                )}
            </div>
        )
    } else {
        return (
            <div className='flex justify-center items-center h-screen flex-col'>
                <FiAlertTriangle className='w-48 h-48 text-red-700' />
                Acceso restringido
            </div>
        )
    }
}

export default Page
