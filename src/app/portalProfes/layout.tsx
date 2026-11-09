import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/getActiveSession";
import { FiActivity, FiBookOpen, FiClipboard, FiExternalLink, FiUsers } from "react-icons/fi";

export const dynamic = "force-dynamic";

const isStaff = (role?: string) => ["admin", "teacher", "teach"].includes(role ?? "");

const staffLinks = [
  { href: "/portalProfes/Alumnos", label: "Alumnos", icon: FiUsers },
  { href: "/portalProfes/Ejercicios", label: "Ejercicios", icon: FiActivity },
  { href: "/portalProfes/newPlani", label: "Nueva rutina", icon: FiClipboard },
  { href: "/portalProfes/Plantillas", label: "Plantillas", icon: FiBookOpen },
];

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getActiveSession();
  if (!session) redirect("/login");
  if (!isStaff(session.user?.rol)) redirect("/portalAlumnos");

  const strapiHost = process.env.STRAPI_HOST;

  return (
    <div className="min-h-screen bg-[#0b0e0c] text-white md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.08] bg-[#0e120f] md:flex">
        <div className="px-5 pb-3 pt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b9dc75]">Espacio de trabajo</p>
          <p className="mt-1 text-sm font-medium text-white/85">Profesores</p>
        </div>

        <nav aria-label="Navegación del portal de profesores" className="flex-1 px-3 py-2">
          <ul className="space-y-1.5">
            {staffLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 transition hover:bg-[#b9dc75]/[0.08] hover:text-[#c6e58d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9dc75]/60"
                >
                  <Icon className="h-4 w-4 text-white/40 transition group-hover:text-[#b9dc75]" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
            {strapiHost && (
              <li>
                <Link
                  href={strapiHost}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 transition hover:bg-[#b9dc75]/[0.08] hover:text-[#c6e58d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9dc75]/60"
                >
                  <FiExternalLink className="h-4 w-4 text-white/40 transition group-hover:text-[#b9dc75]" aria-hidden="true" />
                  Administrar Strapi
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="border-t border-white/[0.08] px-5 py-4 text-xs text-white/35">© 2026 Mackyna</div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="border-b border-white/[0.08] bg-[#0e120f] px-4 py-2 md:hidden">
          <nav aria-label="Navegación del portal de profesores" className="flex gap-2 overflow-x-auto py-1">
            {staffLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 text-xs font-medium text-white/75 transition hover:border-[#b9dc75]/30 hover:text-[#c6e58d]"
              >
                <Icon className="h-4 w-4 text-[#b9dc75]" aria-hidden="true" />
                {label}
              </Link>
            ))}
            {strapiHost && (
              <Link
                href={strapiHost}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 text-xs font-medium text-white/75 transition hover:border-[#b9dc75]/30 hover:text-[#c6e58d]"
              >
                <FiExternalLink className="h-4 w-4 text-[#b9dc75]" aria-hidden="true" />
                Strapi
              </Link>
            )}
          </nav>
        </div>
        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
