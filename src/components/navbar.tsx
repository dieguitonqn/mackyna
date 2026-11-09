"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { GrLogin } from "react-icons/gr";
import { TfiDashboard } from "react-icons/tfi";
import { IoIosLogOut } from "react-icons/io";
import { FaChalkboardTeacher } from "react-icons/fa";
import {
  HamburguesaAdmin,
  HamburguesaTeach,
  HamburguesaUsers,
} from "./hamburguesa";
import { TbRulerMeasure } from "react-icons/tb";
import { FiArrowUpRight } from "react-icons/fi";

function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user.rol === "admin";
  const isTeach = session?.user.rol === "teach" || session?.user.rol === "teacher";
  const isUser = session?.user.rol === "user";

  //

  // console.log(session?.user.rol);

  if (!session) {
    return (
      <div className="relative z-50">
        <nav className="sticky top-0 flex h-[72px] items-center justify-between border-b border-white/[0.08] bg-[#0b0e0c]/95 px-4 text-white shadow-[0_10px_35px_-28px_rgba(0,0,0,.9)] backdrop-blur-xl sm:px-8 lg:px-12">
          <Link href="/" className="shrink-0">
            <Image
              src="/mackyna_verde.png"
              alt="logo mackyna"
              width={112}
              height={56}
              className="h-auto w-[90px] drop-shadow-[0_0_10px_rgba(185,220,117,.22)] sm:w-[108px]"
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-7">
            <Link href="/#beneficios" className="hidden text-xs text-white/60 transition hover:text-[#c6e58d] lg:block">El método</Link>
            <Link href="/#espacio" className="hidden text-xs text-white/60 transition hover:text-[#c6e58d] lg:block">El espacio</Link>
            <Link href="/#ubicacion" className="hidden text-xs text-white/60 transition hover:text-[#c6e58d] lg:block">Ubicación</Link>
            <Link href="/#precios" className="hidden text-xs text-white/60 transition hover:text-[#c6e58d] lg:block">Planes</Link>
            <Link
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2.5 text-xs font-medium transition hover:border-[#b9dc75]/40 hover:bg-white/[0.08] sm:px-4"
              href="/login"
            >
              <GrLogin /><span>Ingresar</span>
            </Link>
            <Link
              href="/signUp"
              className="flex items-center gap-1.5 rounded-xl bg-[#b9dc75] px-3 py-2.5 text-xs font-semibold text-[#172016] transition hover:bg-[#c9e991] sm:px-4"
            >
              <span className="hidden sm:inline">Inscribirme</span><span className="sm:hidden">Sumarme</span><FiArrowUpRight size={15} />
            </Link>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="relative z-50">
      <nav className="flex min-h-[72px] items-center justify-between gap-2 border-b border-white/[0.08] bg-[#0b0e0c]/95 px-4 text-white backdrop-blur-xl sm:px-6 lg:px-10">
        <Link href="/">
          <Image
            src="/mackyna_verde.png"
            alt="logo mackyna"
            width={100}
            height={50}
            className="drop-shadow-[0_0_10px_rgba(185,220,117,.22)]"
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

        <div className="flex flex-row gap-2 items-center">
          {/* Menús visibles solo en pantallas medianas o más grandes */}
          {(isAdmin || isUser) && (
            <Link
              href="/portalAlumnos"
              className="hidden lg:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-white/75 transition hover:border-[#b9dc75]/40 hover:bg-[#b9dc75]/[0.08] hover:text-[#c6e58d]"
            >
              <FaChalkboardTeacher />
              Portal Alumnos
            </Link>
          )}
          {(isAdmin || isUser) && (
            <Link
              href="/portalAlumnos/Metricas"
              className="hidden lg:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-white/75 transition hover:border-[#b9dc75]/40 hover:bg-[#b9dc75]/[0.08] hover:text-[#c6e58d]"
            >
              <TbRulerMeasure />
              Mis Métricas
            </Link>
          )}
          {(isAdmin || isTeach) && (
            <Link
              href="/portalProfes"
              className="hidden lg:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-white/75 transition hover:border-[#b9dc75]/40 hover:bg-[#b9dc75]/[0.08] hover:text-[#c6e58d]"
            >
              <FaChalkboardTeacher />
              Portal Profes
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/dashboard"
              className="hidden lg:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-white/75 transition hover:border-[#b9dc75]/40 hover:bg-[#b9dc75]/[0.08] hover:text-[#c6e58d]"
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
            <div className="block lg:hidden">
              <HamburguesaTeach />
            </div>
          )}
          {isUser && (
            <div className="block lg:hidden">
              <HamburguesaUsers />
            </div>
          )}

          <p className="hidden md:block">|</p>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="hidden md:flex items-center gap-1.5 rounded-lg border border-rose-300/20 bg-rose-400/[0.08] px-3 py-2 text-xs text-rose-200 transition hover:bg-rose-400/[0.16]"
          >
            Log out
            <IoIosLogOut className="h-7 w-7" />
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
