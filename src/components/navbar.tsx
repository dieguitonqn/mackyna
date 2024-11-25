'use client'
import React from 'react'
import Link from 'next/link'
import { signIn, useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { GrLogin } from "react-icons/gr";
import { usePathname } from 'next/navigation'

function Navbar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const isAdmin = session?.user.rol === "admin";
    const isTeach = session?.user.rol === "teacher";
    const isUser = session?.user.rol === "user";
    if (!session) {
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
                    <div>

                        <Link
                            className="flex items-center gap-1 bg-green-800 rounded py-2 px-4"
                            href="/login"
                        >
                            Iniciar sesión
                            <GrLogin />
                        </Link>
                    </div>
                </nav>
            </div>
        );

    }

    if (session) {
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
                    <div className='flex flex-row gap-2 items-center'>
                        {isAdmin &&
                            <Link
                                href={"/dashboard"}
                                className=' px-2 py-2 rounded-sm shadow-sm shadow-green-500 hover:shadow-green-800 hover:shadow-lg '
                                >
                            Dashboard
                            </Link>}
                        {isAdmin &&
                            <Link 
                            href={"/users"}
                            className=' px-2 py-2 rounded-sm shadow-sm shadow-green-500 hover:shadow-green-800 hover:shadow-lg '
                            >
                                Users
                                </Link>
                        }
                        <p>|</p>
                        <p>Hola {session.user.name}!</p>
                        {/* <p>Tu rol es: {session.user.rol}</p> */}
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className='bg-red-500 px-4 py-2 rounded-md hover:font-semibold'
                        >
                            Log out
                        </button>

                    </div>
                </nav>
            </div>
        )
    }

}

export default Navbar
