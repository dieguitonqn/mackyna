import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getActiveSession } from "@/lib/getActiveSession";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import AdminEvent from "@/lib/models/adminEvent";

export const dynamic = "force-dynamic";

const timezone = "America/Argentina/Buenos_Aires";
let previousCpu: { at: number; usage: NodeJS.CpuUsage } | null = null;

const unauthorized = (status: number) =>
  NextResponse.json({ error: "No autorizado" }, { status });

export async function GET(request: NextRequest) {
  const session = await getActiveSession(request);
  if (!session) return unauthorized(401);
  if (session.user?.rol !== "admin") return unauthorized(403);

  try {
    await connect();
    const url = new URL(request.url);
    const rangeDays = Math.min(365, Math.max(7, Number(url.searchParams.get("days")) || 30));
    const from = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

    const [totalUsers, enabledUsers, blockedUsers, newUsers, loginEvents, hourlyLogins, recentEvents, dbHealth] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ habilitado: true, bloqueado: { $ne: true } }),
        User.countDocuments({ bloqueado: true }),
        User.aggregate([
          { $match: { createdAt: { $gte: from } } },
          { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone } }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ]),
        AdminEvent.aggregate([
          { $match: { type: "login", createdAt: { $gte: from } } },
          { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone } }, count: { $sum: 1 }, users: { $addToSet: "$actorId" } } },
          { $sort: { _id: 1 } },
        ]),
        AdminEvent.aggregate([
          { $match: { type: "login", createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
          { $group: { _id: { $hour: { date: "$createdAt", timezone } }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ]),
        AdminEvent.find({ createdAt: { $gte: from } }).sort({ createdAt: -1 }).limit(60).lean(),
        (async () => {
          const startedAt = performance.now();
          await mongoose.connection.db?.command({ ping: 1 });
          return { connected: mongoose.connection.readyState === 1, latencyMs: Math.round(performance.now() - startedAt) };
        })(),
      ]);

    const now = Date.now();
    const cpuUsage = process.cpuUsage();
    let cpuPercent: number | null = null;
    if (previousCpu) {
      const elapsedMicros = (now - previousCpu.at) * 1000;
      const used = process.cpuUsage(previousCpu.usage);
      cpuPercent = elapsedMicros > 0 ? Math.round(((used.user + used.system) / elapsedMicros) * 1000) / 10 : 0;
    }
    previousCpu = { at: now, usage: cpuUsage };

    const rangeLogins = loginEvents.reduce((sum: number, day: { count: number }) => sum + day.count, 0);
    const uniqueActiveUsers = await AdminEvent.distinct("actorId", {
      type: "login",
      createdAt: { $gte: from },
      actorId: { $ne: null },
    });
    type RecentEvent = { _id: unknown; type: string; actorId?: string | null; targetId?: string | null; action?: string | null; message?: string | null; route?: string | null; status?: number | null; createdAt: Date };
    const typedEvents = recentEvents as unknown as RecentEvent[];
    const actors = [...new Set(typedEvents.map((event) => event.actorId).filter((id): id is string => Boolean(id)))];
    const actorUsers = actors.length ? await User.find({ _id: { $in: actors } }).select("nombre apellido").lean() : [];
    const actorNames = new Map(actorUsers.map((user: { _id: unknown; nombre?: string; apellido?: string }) => [String(user._id), `${user.nombre ?? ""} ${user.apellido ?? ""}`.trim()]));

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      rangeDays,
      users: { total: totalUsers, enabled: enabledUsers, blocked: blockedUsers, active: uniqueActiveUsers.length },
      newUsers: newUsers.map((item: { _id: string; count: number }) => ({ date: item._id, count: item.count })),
      logins: loginEvents.map((item: { _id: string; count: number; users: string[] }) => ({ date: item._id, count: item.count, activeUsers: item.users.length })),
      hourlyLogins: Array.from({ length: 24 }, (_, hour) => ({ hour, count: hourlyLogins.find((item: { _id: number }) => item._id === hour)?.count ?? 0 })),
      totalLogins: rangeLogins,
      database: dbHealth,
      process: {
        cpuPercent,
        cpuScope: "Node.js process, percentage of one CPU core",
        memory: process.memoryUsage(),
        uptimeSeconds: Math.round(process.uptime()),
        nodeVersion: process.version,
      },
      events: typedEvents.map((event) => ({
        id: String(event._id),
        type: event.type,
        actor: event.actorId ? actorNames.get(event.actorId) || "Usuario" : "Sistema",
        targetId: event.targetId ?? null,
        action: event.action ?? null,
        message: event.message ?? null,
        route: event.route ?? null,
        status: event.status ?? null,
        createdAt: event.createdAt,
      })),
      infrastructureCollectorConfigured: false,
    });
  } catch {
    return NextResponse.json({ error: "No se pudieron cargar los datos del dashboard" }, { status: 500 });
  }
}
