'use client'
import React from 'react'
import Link from 'next/link'
import { signIn, useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { GrLogin } from "react-icons/gr";

function Navbar() {

    const { data: session } = useSession()
    console.log(session)
    return (
        <div>
            <nav className='flex justify-between text-white bg-black border border-slate-500 px-6 items-center'>
                <Link href={"/"}>
                    <Image 
                    src={"/mackyna.png"}
                    alt="logo mackyna"
                    width={100}
                    height={50}
                    />
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
                        <Link
                            className='flex items-center gap-1 bg-green-800 rounded py-2 px-4'
                            href={"/login"}
                        >
                            
                            Iniciar sesión
                            <GrLogin />
                        </Link>
                    )}
                </div>

            </nav>
        </div>
    )
}

export default Navbar
