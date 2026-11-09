'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiActivity, FiClipboard, FiDatabase, FiUsers } from "react-icons/fi";

const links = [
  { href: "/dashboard", label: "Resumen", icon: FiActivity, key: "overview" },
  { href: "/dashboard#uso", label: "Uso y actividad", icon: FiUsers, key: "uso" },
  { href: "/dashboard#operacion", label: "Operación", icon: FiDatabase, key: "operacion" },
  { href: "/dashboard#auditoria", label: "Auditoría y logs", icon: FiClipboard, key: "auditoria" },
];

export default function DashboardNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  useEffect(() => {
    const syncHash = () => setHash(window.location.hash.slice(1));
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);
  const active = pathname.startsWith("/dashboard/usuarios") ? "users" : hash || "overview";

  return <div className="flex min-h-0 flex-1 flex-col">
    {isAdmin && <>
      <div className="mb-2 mt-10 hidden px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 md:block">Monitoreo</div>
      <nav className="mt-8 space-y-1 md:mt-0">
        {links.map(({ href, label, icon: Icon, key }) => {
          const selected = active === key;
          return <Link key={href} href={href} title={label} aria-current={selected ? "page" : undefined} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${selected ? "bg-[#a6c961]/10 text-[#c2e68b]" : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"}`}>
            <Icon size={17} className="shrink-0" /><span className="hidden md:block">{label}</span>
          </Link>;
        })}
      </nav>
    </>}
    <Link href="/dashboard/usuarios" title="Usuarios" aria-current={active === "users" ? "page" : undefined} className={`mt-auto flex items-center gap-3 rounded-xl border-t border-white/[0.07] px-3 py-4 text-sm transition ${active === "users" ? "bg-[#a6c961]/10 text-[#c2e68b]" : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"}`}>
      <FiUsers size={17} className="shrink-0" /><span className="hidden md:block">Usuarios</span>
    </Link>
  </div>;
}
