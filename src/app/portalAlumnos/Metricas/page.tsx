import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getActiveSession } from "@/lib/getActiveSession";
import connect from "@/lib/db";
import Metric from "@/lib/models/metrics";
import User, { type IUser } from "@/lib/models/user";
import Chart from "@/components/PortalAlumnos/Metricas/charts";
import NewMetric from "@/components/PortalAlumnos/Metricas/newMetric";
import MetricsTable from "@/components/PortalAlumnos/Metricas/metricsTable";
import { MetricCard } from "@/components/PortalAlumnos/Metricas/metricCard";
import { toDateInputValue } from "@/utils/dateOnly";

interface MetricRow {
  _id: ObjectId | string;
  userID: string;
  date: Date | string;
  weigth: number;
  IMC: number;
  body_fat: number;
  body_musc: number;
  visceral_fat: number;
  body_age: number;
  createdAt: Date;
}

const isStaff = (role?: string) => ["admin", "teacher", "teach"].includes(role ?? "");

export default async function MetricsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getActiveSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const sessionUserId = session.user.id.toString();
  const params = await searchParams;
  const requestedUserId = typeof params.id === "string" ? params.id : undefined;
  const canManageMetrics = isStaff(session.user.rol);

  if (
    requestedUserId &&
    (!ObjectId.isValid(requestedUserId) ||
      (requestedUserId !== sessionUserId && !canManageMetrics))
  ) {
    redirect("/portalAlumnos/Metricas");
  }

  const targetUserId = requestedUserId ?? sessionUserId;

  try {
    await connect();
    const [user, rawMetrics] = await Promise.all([
      User.findById(targetUserId).lean<IUser>(),
      Metric.find({ userID: targetUserId }).sort({ date: 1 }).lean<MetricRow[]>(),
    ]);

    if (!user) {
      return (
        <main className="flex flex-1 items-center justify-center px-4 py-16 text-center text-lg text-slate-300">
          No se encontró el usuario.
        </main>
      );
    }

    const metrics = rawMetrics.map((metric) => ({
      ...metric,
      _id: metric._id.toString(),
      date: toDateInputValue(metric.date),
    }));
    const userName = `${user.nombre} ${user.apellido ?? ""}`.trim();

    return (
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c8e994]">Seguimiento personal</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {canManageMetrics ? "Métricas" : "Mis métricas"}
            </h1>
            {canManageMetrics && <p className="mt-2 text-sm text-slate-400">Métricas de {userName}</p>}
          </div>

          {canManageMetrics && <NewMetric userID={targetUserId} userName={userName} />}
        </header>

        {metrics.length === 0 ? (
          <section className="rounded-2xl border border-white/[0.08] bg-[#111713] px-5 py-14 text-center">
            <h2 className="text-lg font-semibold text-white">Todavía no hay mediciones</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Cuando haya mediciones registradas, vas a poder consultar acá la evolución.
            </p>
          </section>
        ) : (
          <>
            <div className="mb-6 grid items-stretch gap-5 lg:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.6fr)]">
              <MetricCard
                userID={user._id.toString()}
                birthDate={user.fecha_nacimiento}
                altura={user.altura}
                objetivo={user.objetivo}
                lesiones={user.lesiones}
              />
              <Suspense fallback={<div className="min-h-72 animate-pulse rounded-2xl border border-white/[0.08] bg-[#111713]" role="status" aria-label="Cargando gráfico" />}>
                <Chart data={metrics} />
              </Suspense>
            </div>
            <MetricsTable data={metrics} />
          </>
        )}
      </main>
    );
  } catch (error) {
    console.error("Error al cargar métricas:", error);
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-16 text-center text-lg text-slate-300">
        No se pudieron cargar las métricas.
      </main>
    );
  }
}
