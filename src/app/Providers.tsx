'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SessionProvider, useSession } from 'next-auth/react'
import { FiAlertCircle } from 'react-icons/fi'

const REQUIRED_FIELDS = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido', label: 'Apellido' },
  { key: 'telefono', label: 'Telefono' },
  { key: 'localidad', label: 'Localidad' },
  { key: 'fecha_nacimiento', label: 'Fecha de nacimiento' },
  { key: 'genero', label: 'Genero' },
  { key: 'altura', label: 'Altura' },
  { key: 'objetivo', label: 'Objetivo de entrenamiento' },
  { key: 'lesiones', label: 'Observaciones' },
]

function getMissingFields(userData: Record<string, unknown>) {
  return REQUIRED_FIELDS.filter(({ key }) => {
    const value = userData[key]

    if (value === null || value === undefined) {
      return true
    }

    if (typeof value === 'string' && value.trim() === '') {
      return true
    }

    if (typeof value === 'number' && value <= 0) {
      return true
    }

    return false
  })
}

function ProfileCompletionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)
  const [missingFields, setMissingFields] = useState<typeof REQUIRED_FIELDS>([])
  const [refreshToken, setRefreshToken] = useState(0)

  const isStudentRole = session?.user?.rol === 'user' || session?.user?.rol === ''
  const canEditProfileRoute = pathname.startsWith('/portalAlumnos/Perfil')

  useEffect(() => {
    const handleProfileUpdated = () => {
      setRefreshToken((current) => current + 1)
    }

    window.addEventListener('profile-updated', handleProfileUpdated)
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdated)
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    if (!session || !isStudentRole || !session.user?.id) {
      setMissingFields([])
      setChecked(true)
      return
    }

    const verifyProfile = async () => {
      try {
        setChecked(false)
        const response = await fetch(`/api/usuarios?id=${session.user.id}`)

        if (!response.ok) {
          setMissingFields([])
          return
        }

        const userData = await response.json()
        setMissingFields(getMissingFields(userData))
      } catch (error) {
        console.error('Error al verificar perfil:', error)
        setMissingFields([])
      } finally {
        setChecked(true)
      }
    }

    verifyProfile()
  }, [session, status, pathname, isStudentRole, refreshToken])

  const showBlockingModal = checked && missingFields.length > 0 && isStudentRole && !canEditProfileRoute

  return (
    <>
      {children}
      {showBlockingModal && (
        <div
          className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm'
          role='alertdialog'
          aria-modal='true'
          aria-labelledby='perfil-incompleto-title'
        >
          <div className='w-full max-w-lg mx-4 rounded-xl border border-red-500/50 bg-gray-900 p-8 shadow-2xl'>
            <div className='flex flex-col items-center text-center gap-4'>
              <FiAlertCircle className='h-14 w-14 text-red-400' />
              <h2 id='perfil-incompleto-title' className='text-2xl font-bold text-white'>
                Perfil incompleto
              </h2>
              <p className='text-sm text-gray-300'>
                Para usar la aplicacion debes completar todos los datos de contacto y deportivos.
              </p>
              <ul className='w-full rounded-lg bg-gray-800 p-4 text-left space-y-1'>
                {missingFields.map(({ key, label }) => (
                  <li key={key} className='text-sm text-red-300'>
                    - {label}
                  </li>
                ))}
              </ul>
              <Link
                href='/portalAlumnos/Perfil'
                className='mt-2 block w-full rounded-lg bg-emerald-600 py-3 text-center font-semibold text-white transition-colors hover:bg-emerald-500'
              >
                Completar perfil ahora
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Providers({children}:{children:React.ReactNode}) {
  return (
    <SessionProvider>
        <ProfileCompletionGuard>
          {children}
        </ProfileCompletionGuard>
    </SessionProvider>
  )
}

export default Providers
