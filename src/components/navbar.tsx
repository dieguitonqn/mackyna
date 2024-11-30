'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { GrLogin } from "react-icons/gr";
// import { usePathname } from 'next/navigation'
import { TfiDashboard } from "react-icons/tfi";
import { IoIosLogOut } from "react-icons/io";

import { FaChalkboardTeacher } from "react-icons/fa";

function Navbar() {
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
                    <p>Hola {session.user.name}!</p>
                    <div className='flex flex-row gap-2 items-center'>
                        {(isAdmin || isUser) &&
                            <Link
                                href={"/portalAlumnos"}
                                className='flex items-center gap-1 px-2 py-2 rounded-sm shadow-sm shadow-green-500 hover:shadow-green-800 hover:shadow-lg '
                            >
                                <FaChalkboardTeacher />
                                Portal Alumnos
                            </Link>
                        }
                        {(isAdmin || isTeach) &&
                            <Link
                                href={"/portalProfes"}
                                className='flex items-center gap-1 px-2 py-2 rounded-sm shadow-sm shadow-green-500 hover:shadow-green-800 hover:shadow-lg '
                            >
                                <FaChalkboardTeacher />
                                Portal Profes
                            </Link>
                        }
                        {isAdmin &&
                            <Link
                                href={"/dashboard"}
                                className=' flex items-center gap-1 px-2 py-2 rounded-sm shadow-sm shadow-green-500 hover:shadow-green-800 hover:shadow-lg '
                            >
                                <TfiDashboard />
                                Admin Dashboard
                            </Link>}

                        {/* {isAdmin &&
                            <Link
                                href={"/users"}
                                className='flex items-center gap-1 px-2 py-2 rounded-sm shadow-sm shadow-green-500 hover:shadow-green-800 hover:shadow-lg '
                            >
                                <FaUsers />
                                Users
                            </Link>
                        } */}

                        <p>|</p>

                        {/* <p>Tu rol es: {session.user.rol}</p> */}
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className='flex items-center gap-1 bg-red-500 px-4 py-2 rounded-md hover:font-semibold'
                        >

                            Log out
                            <IoIosLogOut className='h-7 w-7' />
                        </button>

                    </div>
                </nav>
            </div>
        )
    }

}

export default Navbar
