'use client'
import { FaBars, FaTimes } from "react-icons/fa"; // Librería react-icons para el ícono del menú
import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { IoIosLogOut } from "react-icons/io";



export const HamburguesaAdmin = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="flex flex-col items-center">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>



            {isOpen && (
                <div className="flex mt-4">
                    <ul className="flex flex-col space-y-2 text-left text-xs">
                        <li className="shadow-green-500 shadow-sm rounded-sm justify-center flex "><Link href="/portalProfes" className="text-white hover:font-semibold p-2 transition-all duration-300 ease-in-out rounded-sm ">Portal Profesores</Link></li>
                        <li className="shadow-green-500 shadow-sm rounded-sm justify-center flex "><Link href="/portalAlumnos" className="text-white hover:font-semibold p-2 transition-all duration-300 ease-in-out rounded-sm ">Portal Alumnos</Link></li>
                        <li className="shadow-green-500 shadow-sm rounded-sm justify-center flex "><Link href="/dashboard" className="text-white hover:font-semibold p-2 transition-all duration-300 ease-in-out rounded-sm ">Admin Dashboard</Link></li>
                        <li className="shadow-green-500 shadow-sm rounded-sm justify-center flex "><Link href="/portalAlumos/metricas" className="text-white hover:font-semibold p-2 transition-all duration-300 ease-in-out rounded-sm ">Mis Métricas</Link></li>
                        
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className='flex items-center justify-center gap-1 bg-red-500 px-1 py-1 rounded-md hover:font-semibold'
                        >

                            Log out
                            <IoIosLogOut className='h-4 w-4' />
                        </button>
                    </ul>
                </div>
            )
            }
        </div>
    )
}

export const HamburguesaTeach = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="md:hidden flex flex-col items-center">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>



            {isOpen && (
                <div className="md:hidden mt-4">
                    <ul className="flex flex-col space-y-2">
                        <li
                            className="shadow-green-500 shadow-sm rounded-sm justify-center flex ">
                            <Link
                                href="/portalProfes"
                                className="text-white hover:font-semibold p-2 transition-all duration-300 ease-in-out rounded-sm "
                            >Portal Profesores
                            </Link>
                        </li>
                        <li className="shadow-green-500 shadow-sm rounded-sm justify-center flex "><Link href="/portalAlumos/metricas" className="text-white hover:font-semibold p-2 transition-all duration-300 ease-in-out rounded-sm ">Mis Métricas</Link></li>

                       
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className='flex items-center justify-center gap-1 bg-red-500 px-1 py-1 rounded-md hover:font-semibold'
                        >

                            Log out
                            <IoIosLogOut className='h-4 w-4' />
                        </button>
                    </ul>
                </div>
            )
            }
        </div>
    )
}

export const HamburguesaUsers = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="md:hidden flex flex-col items-center">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>



            {isOpen && (
                <div className="md:hidden mt-4">
                    <ul className="flex flex-col space-y-2">
                        <li className="shadow-green-500 shadow-sm rounded-sm justify-center flex "><Link href="/portalAlumnos" className="text-white hover:font-semibold p-2 transition-all duration-300 ease-in-out rounded-sm ">Portal Alumnos</Link></li>
                        <li className="shadow-green-500 shadow-sm rounded-sm justify-center flex "><Link href="/portalAlumos/metricas" className="text-white hover:font-semibold p-2 transition-all duration-300 ease-in-out rounded-sm ">Mis Métricas</Link></li>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className='flex items-center justify-center gap-1 bg-red-500 px-1 py-1 rounded-md hover:font-semibold'
                        >

                            Log out
                            <IoIosLogOut className='h-4 w-4' />
                        </button>
                    </ul>
                </div>
            )
            }
        </div>
    )
}