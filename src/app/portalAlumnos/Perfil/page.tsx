
import PerfilUserForm from '@/components/PortalAlumnos/Perfil/perfilForm';
import { authOptions } from '@/lib/auth0';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { FormUserValues, IUser } from '@/types/user';

import React from 'react';
import User from '@/lib/models/user';
import { ObjectId } from 'mongodb';



async function page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login');
    }
    const sessionUserID = session?.user.id.toString();
    // console.log("session: " + sessionUserID);
    const urlUserId = (await searchParams).id as string;
    // console.log("url: " + urlUserId);

    if (urlUserId) {
        try {
            const user = await User.findOne({ _id: new ObjectId(urlUserId) });
            console.log("usuario url: " + user);
            return (
                <div className='md:h-screen h-full '>
                    <div className='text-6xl text-slate-300 font-semibold justify-center text-center my-10'>
                        Perfil de usuario
                    </div>
                    <div>
                        {/* <PerfilUserForm user={user}/> */}
                    </div>
                </div>
            )

        } catch (error: unknown) {
            console.log(error);
            window.alert("Usuario no encontrado");


        }

    } else if (sessionUserID && !urlUserId) {
        try {
            const rawUser = await User.findOne({ email: session.user.email }).lean<IUser>();
           
            const user: FormUserValues = {
                ...rawUser,
                _id: rawUser!._id.toString(),
                nombre: rawUser!.nombre,
                email: rawUser!.email,
                pwd: rawUser!.pwd,
                rol: rawUser!.rol,

            }
            
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
            window.alert("Usuario no encontrado");
            redirect('/login');

        }

    } else {
        redirect('/login');
    }
}

export default page;
