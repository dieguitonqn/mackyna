'use client'
import React from 'react'
import Link from 'next/link'
import { signIn, useSession, signOut } from 'next-auth/react'

// function SignIn() {
//     return (
//         <div>
//             <button onClick={() => signIn('google')}>Sign in with Google</button>
//             <button onClick={() => signIn('credentials')}>Sign in with email and password</button>
//         </div>
//     )
// }

function Navbar() {

    const { data: session } = useSession()
    console.log(session)
    return (
        <div>
            <nav className='flex justify-between text-white bg-black border border-slate-500 px-6 items-center'>
                <Link href={"/"}>
                    <h1>Next Google</h1>
                </Link>

                <div className='flex gap-2'>
                    {session?.user ? (
                        <div className='flex flex-row gap-2 items-center'>
                            <Link href={"/dashboard"}>Dashboard</Link>
                            <p>Hola {session.user.name}!</p>
                            <button
                                onClick={() => signOut()}
                                className='bg-red-500 px-4 py-2'
                            >
                                Log out
                            </button>

                        </div>
                    ) : (
                        <button
                            className='bg-blue-500 py-2 px-4'
                            onClick={() => signIn("google")}
                        >
                            Iniciar sesión
                        </button>
                    )}
                </div>

            </nav>
        </div>
    )
}

export default Navbar
