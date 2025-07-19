"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { GrLogin } from "react-icons/gr";
import { TfiDashboard } from "react-icons/tfi";
import { IoIosLogOut } from "react-icons/io";
import { FaChalkboardTeacher } from "react-icons/fa";
import { BsCart4 } from "react-icons/bs";
import {
  HamburguesaAdmin,
  HamburguesaTeach,
  HamburguesaUsers,
} from "./hamburguesa";
import { TbRulerMeasure } from "react-icons/tb";

function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user.rol === "admin";
  const isTeach = session?.user.rol === "teach";
  const isUser = session?.user.rol === "user";

  //

  // console.log(session?.user.rol);

  if (!session) {
    return (
      <div>
        <nav className="flex justify-between text-white bg-black border border-slate-500 px-6 items-center">
          <Link href="/">
            <Image
              src="/mackyna_verde.png"
              alt="logo mackyna"
              width={100}
              height={50}
            />
          </Link>
          <div>
            <Link
              className="hidden lg:flex  items-center gap-1 px-2 py-2 rounded-sm shadow-sm shadow-green-500 hover:shadow-green-800 hover:shadow-lg"
              href="/Tienda"
            >
              Tienda <BsCart4 /> 
            </Link>
          </div>
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

  return (
    <div>
      <nav className="flex justify-between gap-2 text-white bg-black border border-slate-500 px-6 items-center">
        <Link href="/">
          <Image
            src="/mackyna_verde.png"
            alt="logo mackyna"
            width={100}
            height={50}
          />
        </Link>
        <Link
          href="/portalAlumnos/Perfil"
          className="flex flex-row items-center gap-2"
        >
          Hola {session.user.name}!
          {session.user.image && (
            <img
              src={session.user.image}
              alt="user image"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          )}
        </Link>
        <div>
            <Link
              className="hidden lg:flex text-sm items-center gap-1 px-2 py-2 rounded-sm shadow-sm shadow-green-500 hover:shadow-green-800 hover:shadow-lg"
              href="/Tienda"
            >
              Tienda <BsCart4 /> 
            </Link>
          </div>

        <div className="flex flex-row gap-2 items-center">
          {/* Menús visibles solo en pantallas medianas o más grandes */}
          {(isAdmin || isUser) && (
            <Link
              href="/portalAlumnos"
              className="hidden lg:flex text-sm items-center gap-1 px-2 py-2 rounded-sm shadow-sm shadow-green-500 hover:shadow-green-800 hover:shadow-lg"
            >
              <FaChalkboardTeacher />
              Portal Alumnos
            </Link>
          )}
          {(isAdmin || isUser) && (
            <Link
              href="/portalAlumnos/Metricas"
              className="hidden lg:flex text-sm items-center gap-1 px-2 py-2 rounded-sm shadow-sm shadow-green-500 hover:shadow-green-800 hover:shadow-lg"
            >
              <TbRulerMeasure />
              Mis Métricas
            </Link>
          )}
          {(isAdmin || isTeach) && (
            <Link
              href="/portalProfes"
              className="hidden lg:flex text-sm items-center gap-1 px-2 py-2 rounded-sm shadow-sm shadow-green-500 hover:shadow-green-800 hover:shadow-lg"
            >
              <FaChalkboardTeacher />
              Portal Profes
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/dashboard"
              className="hidden lg:flex text-sm items-center gap-1 px-2 py-2 rounded-sm shadow-sm shadow-green-500 hover:shadow-green-800 hover:shadow-lg"
            >
              <TfiDashboard />
              Admin Dashboard
            </Link>
          )}

          {/* Menú hamburguesa para pantallas pequeñas */}
          {isAdmin && (
            <div className="block lg:hidden">
              <HamburguesaAdmin />
            </div>
          )}
          {isTeach && (
            <div className="block md:hidden">
              <HamburguesaTeach />
            </div>
          )}
          {isUser && (
            <div className="block md:hidden">
              <HamburguesaUsers />
            </div>
          )}

          <p className="hidden md:block">|</p>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="hidden md:flex items-center gap-1 bg-red-500 px-4 py-2 rounded-md hover:font-semibold"
          >
            Log out
            <IoIosLogOut className="h-7 w-7" />
          </button>
        </div>
        {/* <CartSidebar /> */}
      </nav>
    </div>
  );
}

export default Navbar;
