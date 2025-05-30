"use client";
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
      <button
        onClick={toggleMenu}
        className="text-white focus:outline-none z-50"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-40">

          <button
            onClick={toggleMenu}
            className="absolute top-6 right-6 text-white text-3xl focus:outline-none"
            aria-label="Cerrar menú"
          >
            {/* <FaTimes /> */}
          </button>
          <ul className="flex flex-col space-y-6 text-left text-xs">
            <li className="shadow-green-500 shadow-md border border-green-800 text-xl rounded-sm justify-center flex ">
              <Link
                href="/portalProfes"
                className="text-white hover:font-semibold px-6 py-4 transition-all duration-300 ease-in-out rounded-sm "
                onClick={toggleMenu}
              >
                Portal Profesores
              </Link>
            </li>
            <li className="shadow-green-500 shadow-md border border-green-800 text-xl  rounded-sm justify-center flex ">
              <Link
                href="/portalAlumnos"
                className="text-white hover:font-semibold px-6 py-4 transition-all duration-300 ease-in-out rounded-sm "
                onClick={toggleMenu}
              >
                Portal Alumnos
              </Link>
            </li>
            <li className="shadow-green-500 shadow-md border border-green-800 text-xl  rounded-sm justify-center flex ">
              <Link
                href="/dashboard"
                className="text-white hover:font-semibold px-6 py-4 transition-all duration-300 ease-in-out rounded-sm "
                onClick={toggleMenu}
              >
                Admin Dashboard
              </Link>
            </li>
            <li className="shadow-green-500 shadow-md border border-green-800 text-xl  rounded-sm justify-center flex ">
              <Link
                href="/portalAlumnos/Metricas"
                className="text-white hover:font-semibold px-6 py-4 transition-all duration-300 ease-in-out rounded-sm "
                onClick={toggleMenu}
              >
                Mis Métricas
              </Link>
            </li>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center justify-center gap-1 bg-red-500 px-6 py-4 rounded-md hover:font-semibold"
            >
              Log out
              <IoIosLogOut className="h-4 w-4" />
            </button>
          </ul>
        </div>
      )}
    </div>
  );
};

export const HamburguesaTeach = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={toggleMenu}
        className="text-white focus:outline-none z-50"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-40">

          <button
            onClick={toggleMenu}
            className="absolute top-6 right-6 text-white text-3xl focus:outline-none"
            aria-label="Cerrar menú"
          >
            {/* <FaTimes /> */}
          </button>
          <ul className="flex flex-col space-y-6 text-left text-xs">
            <li className="shadow-green-500 shadow-md border border-green-800 text-xl rounded-sm justify-center flex ">
              <Link
                href="/portalProfes"
                className="text-white hover:font-semibold px-6 py-4 transition-all duration-300 ease-in-out rounded-sm "
                onClick={toggleMenu}
              >
                Portal Profesores
              </Link>
            </li>
            <li className="shadow-green-500 shadow-md border border-green-800 text-xl  rounded-sm justify-center flex ">
              <Link
                href="/portalAlumnos"
                className="text-white hover:font-semibold px-6 py-4 transition-all duration-300 ease-in-out rounded-sm "
                onClick={toggleMenu}
              >
                Portal Alumnos
              </Link>
            </li>
            
            <li className="shadow-green-500 shadow-md border border-green-800 text-xl  rounded-sm justify-center flex ">
              <Link
                href="/portalAlumnos/Metricas"
                className="text-white hover:font-semibold px-6 py-4 transition-all duration-300 ease-in-out rounded-sm "
                onClick={toggleMenu}
              >
                Mis Métricas
              </Link>
            </li>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center justify-center gap-1 bg-red-500 px-6 py-4 rounded-md hover:font-semibold"
            >
              Log out
              <IoIosLogOut className="h-4 w-4" />
            </button>
          </ul>
        </div>
      )}
    </div>
  );
};

export const HamburguesaUsers = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={toggleMenu}
        className="text-white focus:outline-none z-50"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-40">

          <button
            onClick={toggleMenu}
            className="absolute top-6 right-6 text-white text-3xl focus:outline-none"
            aria-label="Cerrar menú"
          >
            {/* <FaTimes /> */}
          </button>
          <ul className="flex flex-col space-y-6 text-left text-xs">
            
            <li className="shadow-green-500 shadow-md border border-green-800 text-xl  rounded-sm justify-center flex ">
              <Link
                href="/portalAlumnos"
                className="text-white hover:font-semibold px-6 py-4 transition-all duration-300 ease-in-out rounded-sm "
                onClick={toggleMenu}
              >
                Portal Alumnos
              </Link>
            </li>
            
            <li className="shadow-green-500 shadow-md border border-green-800 text-xl  rounded-sm justify-center flex ">
              <Link
                href="/portalAlumnos/Metricas"
                className="text-white hover:font-semibold px-6 py-4 transition-all duration-300 ease-in-out rounded-sm "
                onClick={toggleMenu}
              >
                Mis Métricas
              </Link>
            </li>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center justify-center gap-1 bg-red-500 px-6 py-4 rounded-md hover:font-semibold"
              
            >
              Log out
              <IoIosLogOut className="h-4 w-4" />
            </button>
          </ul>
        </div>
      )}
    </div>
  );
};
