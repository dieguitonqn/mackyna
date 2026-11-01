import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getActiveSession } from "@/lib/getActiveSession";
import connect from "@/lib/db";
import Metric from "@/lib/models/metrics";
import User from "@/lib/models/user";
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
      User.findById(targetUserId).lean(),
      Metric.find({ userID: targetUserId }).sort({ date: 1 }).lean<MetricRow[]>(),
    ]);

    if (!user) {
      return (
        <div className="flex h-screen items-center justify-center text-3xl text-white">
          No se encontró el usuario.
        </div>
      );
    }

    const metrics = rawMetrics.map((metric) => ({
      ...metric,
      _id: metric._id.toString(),
      date: toDateInputValue(metric.date),
    }));
    const userName = `${user.nombre} ${user.apellido ?? ""}`.trim();

    return (
      <div className="h-full justify-center gap-10">
        <h1 className="my-10 text-center text-4xl font-semibold text-slate-300">
          Métricas de {userName}
        </h1>

        {canManageMetrics && (
          <div className="my-5">
            <NewMetric userID={targetUserId} userName={userName} />
          </div>
        )}

        {metrics.length === 0 ? (
          <p className="my-10 text-center text-2xl text-white">
            No se encontraron métricas para este usuario.
          </p>
        ) : (
          <>
            <div className="my-10 flex flex-wrap justify-center items-center gap-10">
              <MetricCard
                userID={user._id.toString()}
                birthDate={user.fecha_nacimiento}
                altura={user.altura}
                objetivo={user.objetivo}
                lesiones={user.lesiones}
              />
              <Suspense fallback={<div className="text-4xl text-white">Cargando…</div>}>
                <Chart data={metrics} />
              </Suspense>
            </div>
            <MetricsTable data={metrics} />
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error al cargar métricas:", error);
    return (
      <div className="flex h-screen items-center justify-center text-3xl text-white">
        No se pudieron cargar las métricas.
      </div>
    );
  }
}
