import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import type { Session } from "next-auth";
import Metric from "@/lib/models/metrics";
import User from "@/lib/models/user";
import { getActiveSession } from "@/lib/getActiveSession";
import connect from "@/lib/db";
import { parseDateOnlyToUTC } from "@/utils/dateOnly";

const isStaff = (session: Session | null) =>
  ["admin", "teacher", "teach"].includes(session?.user?.rol ?? "");

const getStaffSession = async (req: Request) => {
  const session = await getActiveSession(req);
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "No autorizado" }, { status: 401 }),
    };
  }
  if (!isStaff(session)) {
    return {
      session,
      response: NextResponse.json({ error: "No autorizado" }, { status: 403 }),
    };
  }
  return { session, response: null };
};

const metricFields = [
  "weigth",
  "IMC",
  "body_fat",
  "body_musc",
  "visceral_fat",
  "body_age",
] as const;

const normalizeMetricValues = (value: Record<string, unknown>) => {
  const normalized: Record<(typeof metricFields)[number], number> = {} as Record<
    (typeof metricFields)[number],
    number
  >;

  for (const field of metricFields) {
    const numberValue = typeof value[field] === "number" || typeof value[field] === "string"
      ? Number(value[field])
      : NaN;
    if (!Number.isFinite(numberValue) || numberValue < 0) {
      return null;
    }
    normalized[field] = numberValue;
  }

  return normalized;
};

const readBody = async (req: Request): Promise<Record<string, unknown> | null> => {
  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return null;
    }
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
};

export async function POST(req: Request) {
  const { response } = await getStaffSession(req);
  if (response) return response;

  const body = await readBody(req);
  if (!body || typeof body.userID !== "string" || !ObjectId.isValid(body.userID)) {
    return NextResponse.json({ error: "Usuario inválido" }, { status: 400 });
  }

  const date = typeof body.date === "string" ? parseDateOnlyToUTC(body.date) : null;
  const values = normalizeMetricValues(body);
  if (!date || !values) {
    return NextResponse.json({ error: "Datos de medición inválidos" }, { status: 400 });
  }

  try {
    await connect();
    const user = await User.findById(body.userID).select("_id").lean();
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    await Metric.create({ userID: body.userID, date, ...values });
    await User.updateOne({ _id: body.userID }, { $set: { ultima_metrica: new Date() } });
    return NextResponse.json({ message: "Métrica creada" }, { status: 201 });
  } catch (error) {
    console.error("Error al crear métrica:", error);
    return NextResponse.json({ error: "No se pudo crear la métrica" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { response } = await getStaffSession(req);
  if (response) return response;

  const body = await readBody(req);
  if (!body || typeof body._id !== "string" || !ObjectId.isValid(body._id)) {
    return NextResponse.json({ error: "Métrica inválida" }, { status: 400 });
  }

  const date = typeof body.date === "string" ? parseDateOnlyToUTC(body.date) : null;
  const values = normalizeMetricValues(body);
  if (!date || !values) {
    return NextResponse.json({ error: "Datos de medición inválidos" }, { status: 400 });
  }

  try {
    await connect();
    const updatedMetric = await Metric.findByIdAndUpdate(
      body._id,
      { $set: { date, ...values } },
      { new: true, runValidators: true }
    );
    if (!updatedMetric) {
      return NextResponse.json({ error: "Métrica no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ message: "Métrica actualizada" }, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar métrica:", error);
    return NextResponse.json({ error: "No se pudo actualizar la métrica" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { response } = await getStaffSession(req);
  if (response) return response;

  const id = new URL(req.url).searchParams.get("id");
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID de métrica inválido" }, { status: 400 });
  }

  try {
    await connect();
    const deletedMetric = await Metric.findByIdAndDelete(id);
    if (!deletedMetric) {
      return NextResponse.json({ error: "Métrica no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ message: "Métrica eliminada" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar métrica:", error);
    return NextResponse.json({ error: "No se pudo eliminar la métrica" }, { status: 500 });
  }
}
