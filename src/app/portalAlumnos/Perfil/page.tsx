
import PerfilUserForm from '@/components/PortalAlumnos/Perfil/perfilForm';
import { authOptions } from '@/lib/auth0';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { FormUserValues, IUser } from '@/types/user';

import React from 'react';
import User from '@/lib/models/user';
import { ObjectId } from 'mongodb';
import connect from '@/lib/db';

const mapToFormUserValues = (rawUser: IUser): FormUserValues => ({
    _id: rawUser._id.toString(),
    nombre: rawUser.nombre,
    apellido: rawUser.apellido || '',
    genero: rawUser.genero || '',
    fecha_nacimiento: rawUser.fecha_nacimiento || null,
    localidad: rawUser.localidad || '',
    telefono: rawUser.telefono || '',
    email: rawUser.email,
    pwd: rawUser.pwd,
    rol: rawUser.rol,
    altura: rawUser.altura || 0,
    objetivo: rawUser.objetivo || '',
    lesiones: rawUser.lesiones || '',
    redes: {
        Facebook: rawUser.redes?.Facebook || '',
        Instagram: rawUser.redes?.Instagram || '',
        Twitter: rawUser.redes?.Twitter || '',
    },
});

async function page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login');
    }

    await connect();

    const sessionUserID = session?.user.id.toString();
    const role = session.user.rol;
    const params = await searchParams;
    const rawParamId = params.id;
    const urlUserId = Array.isArray(rawParamId) ? rawParamId[0] : rawParamId;

    if (urlUserId) {
        if (!ObjectId.isValid(urlUserId)) {
            return (
                <div className='md:h-screen h-full'>
                    <div className='text-4xl text-slate-300 font-semibold justify-center text-center my-10'>
                        ID de usuario inválido
                    </div>
                </div>
            );
        }

        const canAccessForeignProfile = role === 'teach' || role === 'admin';
        const isOwnProfile = sessionUserID === urlUserId;

        if (!canAccessForeignProfile && !isOwnProfile) {
            redirect('/portalAlumnos/Perfil');
        }

        try {
            const rawUser = await User.findOne({ _id: new ObjectId(urlUserId) }).lean<IUser>();

            if (!rawUser) {
                return (
                    <div className='md:h-screen h-full'>
                        <div className='text-4xl text-slate-300 font-semibold justify-center text-center my-10'>
                            Usuario no encontrado
                        </div>
                    </div>
                );
            }

            const user = mapToFormUserValues(rawUser);

            return (
                <div className='md:h-screen h-full '>
                    <div className='text-6xl text-slate-300 font-semibold justify-center text-center my-10'>
                        Perfil de usuario
                    </div>
                    <div>
                        <PerfilUserForm user={user} />
                    </div>
                </div>
            )

        } catch (error: unknown) {
            console.log(error);
            return (
                <div className='md:h-screen h-full'>
                    <div className='text-4xl text-slate-300 font-semibold justify-center text-center my-10'>
                        Ocurrió un error al cargar el perfil
                    </div>
                </div>
            );
        }

    } else if (sessionUserID && !urlUserId) {
        try {
            const rawUser = await User.findOne({ email: session.user.email }).lean<IUser>();

            if (!rawUser) {
                redirect('/login');
            }

            const user = mapToFormUserValues(rawUser!);
            
            return (
                <div className='w-[620]:h-screen h-full '>
                    <div className='text-6xl text-slate-300 font-semibold justify-center text-center my-10'>
                        Perfil de usuario
                    </div>
                    <div>
                        <PerfilUserForm user={user} />
                    </div>
                </div>
            );

        } catch (error: unknown) {
            console.log(error);
            redirect('/login');

        }

    } else {
        redirect('/login');
    }
}

export default page;
