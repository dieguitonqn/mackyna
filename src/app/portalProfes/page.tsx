import Link from "next/link";
import React from "react";
import User from "@/lib/models/user";
import { ConfettiComponent } from "@/components/PortalProfes/Confetti";
import connect from "@/lib/db";
import { formatDateOnlyEs, getUTCMonthDayKey } from "@/utils/dateOnly";
import { FiActivity, FiArrowRight, FiBookOpen, FiClipboard, FiUsers } from "react-icons/fi";

export const dynamic = "force-dynamic";

const quickLinks = [
  {
    href: "/portalProfes/Alumnos",
    title: "Alumnos",
    description: "Consultá perfiles, rutinas y métricas.",
    icon: FiUsers,
  },
  {
    href: "/portalProfes/Ejercicios",
    title: "Ejercicios",
    description: "Administrá el catálogo de ejercicios.",
    icon: FiActivity,
  },
  {
    href: "/portalProfes/newPlani",
    title: "Nueva rutina",
    description: "Armá un plan personalizado para un alumno.",
    icon: FiClipboard,
  },
  {
    href: "/portalProfes/Plantillas",
    title: "Plantillas",
    description: "Reutilizá estructuras de entrenamiento.",
    icon: FiBookOpen,
  },
];

const getBirthdayDateForYear = (birthDate: Date | string, year: number) => {
  const parsed = new Date(birthDate);
  if (isNaN(parsed.getTime())) return null;
  return new Date(year, parsed.getUTCMonth(), parsed.getUTCDate());
};

const birthdayName = (user: { nombre?: string; apellido?: string }) =>
  `${user.nombre ?? ""} ${user.apellido ?? ""}`.trim();

const BirthdayList = ({
  users,
  emptyText,
}: {
  users: Array<{ _id: unknown; nombre?: string; apellido?: string; fecha_nacimiento?: Date | string }>;
  emptyText: string;
}) => (
  <ul className="divide-y divide-white/[0.07]">
    {users.length ? users.map((user) => (
      <li key={String(user._id)} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
        <span className="min-w-0 truncate text-sm font-medium text-slate-200">{birthdayName(user)}</span>
        <span className="shrink-0 text-xs text-slate-500">
          {user.fecha_nacimiento
            ? formatDateOnlyEs(user.fecha_nacimiento, { day: "2-digit", month: "long" })
            : ""}
        </span>
      </li>
    )) : (
      <li className="py-3 text-sm text-slate-500">{emptyText}</li>
    )}
  </ul>
);

const PaginaProfes = async () => {
  await connect();
  const users = await User.find().lean();
  const today = new Date();
  const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayKey = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const todayBirthdays = users.filter((user) =>
    Boolean(user?.fecha_nacimiento) && getUTCMonthDayKey(user.fecha_nacimiento) === todayKey
  );

  const upcomingBirthdays = users
    .filter((user) => {
      if (!user?.fecha_nacimiento) return false;
      const birthdayThisYear = getBirthdayDateForYear(user.fecha_nacimiento, today.getFullYear());
      return Boolean(birthdayThisYear && birthdayThisYear > todayWithoutTime);
    })
    .sort((a, b) => {
      const aDate = getBirthdayDateForYear(a.fecha_nacimiento!, today.getFullYear());
      const bDate = getBirthdayDateForYear(b.fecha_nacimiento!, today.getFullYear());
      if (!aDate || !bDate) return 0;
      return aDate.getTime() - bDate.getTime();
    })
    .slice(0, 5);

  const pastBirthdays = users
    .filter((user) => {
      if (!user?.fecha_nacimiento) return false;
      const birthdayThisYear = getBirthdayDateForYear(user.fecha_nacimiento, today.getFullYear());
      return Boolean(birthdayThisYear && birthdayThisYear < todayWithoutTime);
    })
    .sort((a, b) => {
      const aDate = getBirthdayDateForYear(a.fecha_nacimiento!, today.getFullYear());
      const bDate = getBirthdayDateForYear(b.fecha_nacimiento!, today.getFullYear());
      if (!aDate || !bDate) return 0;
      return bDate.getTime() - aDate.getTime();
    })
    .slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10">
      <header className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#17231a] via-[#101713] to-[#101310] px-6 py-8 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#b9dc75]/[0.08] blur-[85px]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b9dc75]">Espacio de trabajo</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Portal de profesores</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Gestioná alumnos y prepará entrenamientos personalizados desde un solo lugar.
          </p>
        </div>
      </header>

      <section aria-label="Accesos rápidos" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex min-h-40 flex-col rounded-2xl border border-white/[0.08] bg-[#111713] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#b9dc75]/30 hover:bg-[#151c16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9dc75]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#b9dc75]/15 bg-[#b9dc75]/[0.08] text-[#b9dc75]">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="mt-4 flex items-center justify-between gap-3 text-base font-semibold text-white">
              {title}
              <FiArrowRight className="shrink-0 text-white/30 transition group-hover:translate-x-1 group-hover:text-[#c6e58d]" aria-hidden="true" />
            </span>
            <span className="mt-1 text-sm leading-5 text-slate-500">{description}</span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="birthday-heading" className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b9dc75]">Acompañamiento</p>
            <h2 id="birthday-heading" className="mt-1 text-xl font-semibold text-white">Cumpleaños de alumnos</h2>
          </div>
          <span className="text-sm text-slate-500">Seguimiento para estar presentes en cada fecha</span>
        </div>

        {todayBirthdays.length > 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-[#b9dc75]/20 bg-[#b9dc75]/[0.07] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b9dc75]">Hoy</p>
                <h3 className="mt-1 text-lg font-semibold text-white">¡Feliz cumpleaños!</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {todayBirthdays.map((user) => (
                  <span key={String(user._id)} className="rounded-full border border-white/10 bg-black/15 px-3 py-1.5 text-sm text-slate-100">
                    {birthdayName(user)}
                  </span>
                ))}
              </div>
            </div>
            <ConfettiComponent repeat={false} />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#111713] px-5 py-4">
            <span className="text-xl" aria-hidden="true">🎂</span>
            <p className="text-sm text-slate-400">No hay cumpleaños hoy.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.08] bg-[#111713] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-white">Próximos cumpleaños</h3>
              <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-slate-400">Próximos 5</span>
            </div>
            <BirthdayList users={upcomingBirthdays} emptyText="No hay cumpleaños próximos registrados." />
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-[#111713] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-white">Cumpleaños recientes</h3>
              <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-slate-400">Últimos 5</span>
            </div>
            <BirthdayList users={pastBirthdays} emptyText="Todavía no hubo cumpleaños este año." />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaginaProfes;
