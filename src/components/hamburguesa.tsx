'use client';

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { FiActivity, FiArrowUpRight, FiBarChart2, FiHome, FiLogOut, FiMenu, FiUsers, FiX } from "react-icons/fi";

type MenuLink = {
  href: string;
  label: string;
  icon: typeof FiHome;
};

const adminLinks: MenuLink[] = [
  { href: "/portalProfes", label: "Portal Profesores", icon: FiActivity },
  { href: "/portalAlumnos", label: "Portal Alumnos", icon: FiUsers },
  { href: "/portalAlumnos/Metricas", label: "Mis Métricas", icon: FiBarChart2 },
  { href: "/dashboard", label: "Admin Dashboard", icon: FiHome },
];

const teacherLinks: MenuLink[] = [
  { href: "/portalProfes", label: "Portal Profesores", icon: FiActivity },
  { href: "/portalAlumnos", label: "Portal Alumnos", icon: FiUsers },
  { href: "/portalAlumnos/Metricas", label: "Mis Métricas", icon: FiBarChart2 },
];

const userLinks: MenuLink[] = [
  { href: "/portalAlumnos", label: "Portal Alumnos", icon: FiUsers },
  { href: "/portalAlumnos/Metricas", label: "Mis Métricas", icon: FiBarChart2 },
];

function HamburgerMenu({ links }: { links: MenuLink[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);
  const overlay = mounted && isOpen ? createPortal(
    <div
      className="fixed inset-0 z-[1000] flex min-h-[100dvh] flex-col overflow-y-auto bg-[#0b0e0c] text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#b9dc75]/[0.08] blur-[100px]" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#b9dc75]/[0.06] blur-[90px]" />
      </div>

      <header className="relative z-10 flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.08] px-5 sm:px-8">
        <Link href="/" onClick={close} aria-label="Mackyna, inicio">
          <Image src="/mackyna_verde.png" alt="Mackyna" width={104} height={52} className="h-auto w-[96px] drop-shadow-[0_0_10px_rgba(185,220,117,.25)]" />
        </Link>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          aria-label="Cerrar menú"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-[#b9dc75]/40 hover:bg-[#b9dc75]/[0.08] hover:text-[#c6e58d]"
        >
          <FiX size={20} />
        </button>
      </header>

      <nav className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-5 py-10 sm:px-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b9dc75]">Tu espacio Mackyna</p>
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-white">¿A dónde vamos?</h2>
        <ul className="space-y-3">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={close}
                className="group flex min-h-[64px] items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5 transition hover:border-[#b9dc75]/35 hover:bg-[#b9dc75]/[0.07]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#b9dc75]/15 bg-[#b9dc75]/[0.08] text-[#b9dc75] transition group-hover:bg-[#b9dc75]/15"><Icon size={18} /></span>
                <span className="flex-1 text-sm font-medium text-white/85">{label}</span>
                <FiArrowUpRight className="text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#c6e58d]" size={17} />
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => void signOut({ callbackUrl: "/" })}
          className="mt-8 flex min-h-[54px] items-center justify-center gap-2 rounded-xl border border-rose-300/20 bg-rose-400/[0.07] px-4 py-3 text-sm font-medium text-rose-200 transition hover:bg-rose-400/[0.14]"
        >
          Cerrar sesión <FiLogOut size={16} />
        </button>
      </nav>

      <p className="relative z-10 pb-6 text-center text-[10px] uppercase tracking-[0.18em] text-white/30">Entrená con intención</p>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={isOpen}
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/85 transition hover:border-[#b9dc75]/40 hover:bg-[#b9dc75]/[0.08] hover:text-[#c6e58d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9dc75]/60"
      >
        <FiMenu size={20} />
      </button>
      {overlay}
    </>
  );
}

export const HamburguesaAdmin = () => <HamburgerMenu links={adminLinks} />;
export const HamburguesaTeach = () => <HamburgerMenu links={teacherLinks} />;
export const HamburguesaUsers = () => <HamburgerMenu links={userLinks} />;
