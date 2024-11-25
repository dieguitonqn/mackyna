'use client';

import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (session) {
      const { rol } = session.user;

      if (rol === 'admin') {
        router.push('/dashboard');
      } else if (rol === 'user') {
        router.push('/portalAlumnos');
      }
    }
  }, [session, status]);

  return (
    <>
      {status === 'loading' && <p>Cargando...</p>}
      {session && <p>Redireccionando...</p>}
      {!session && <h1>Página de Inicio</h1>}
    </>
  );
}