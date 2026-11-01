import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import Plantilla from "@/lib/models/plantilla";
import connect from "@/lib/db";
import { getActiveSession } from "@/lib/getActiveSession";

const MAX_BODY_LENGTH = 1_000_000;
const isStaff = (session: Session | null) =>
  ["admin", "teacher", "teach"].includes(session?.user?.rol ?? "");

const authorizeStaff = async (req: Request) => {
  const session = await getActiveSession(req);
  if (!session) {
    return { session: null, response: NextResponse.json({ error: "No autorizado" }, { status: 401 }) };
  }
  if (!isStaff(session)) {
    return { session, response: NextResponse.json({ error: "No autorizado" }, { status: 403 }) };
  }
  return { session, response: null };
};

const readBody = async (req: Request): Promise<Record<string, unknown> | null> => {
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_LENGTH) return null;

  try {
    const text = await req.text();
    if (!text || text.length > MAX_BODY_LENGTH) return null;
    const body: unknown = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) return null;
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
};

const getTemplateFields = (body: Record<string, unknown>) => {
  const { nombre, nombreUser, descripcion, trainingDays } = body;
  if (
    typeof nombre !== "string" || !nombre.trim() || nombre.trim().length > 120 ||
    typeof nombreUser !== "string" || !nombreUser.trim() || nombreUser.trim().length > 200 ||
    typeof descripcion !== "string" || descripcion.length > 2_000 ||
    !Array.isArray(trainingDays) || trainingDays.length > 6 ||
    JSON.stringify(trainingDays).length > MAX_BODY_LENGTH - 10_000
  ) {
    return null;
  }

  return {
    nombre: nombre.trim(),
    nombreUser: nombreUser.trim(),
    descripcion: descripcion.trim(),
    trainingDays,
  };
};

export const GET = async (req: Request) => {
  const { response } = await authorizeStaff(req);
  if (response) return response;

  try {
    await connect();
    const id = new URL(req.url).searchParams.get("plantillaID");
    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "ID de plantilla inválido" }, { status: 400 });
      }
      const plantilla = await Plantilla.findById(id);
      if (!plantilla) return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 });
      return NextResponse.json({ ...plantilla.toObject(), _id: plantilla._id.toString() });
    }

    const plantillas = await Plantilla.find();
    return NextResponse.json(plantillas.map((plantilla) => ({
      ...plantilla.toObject(),
      _id: plantilla._id.toString(),
    })));
  } catch (error) {
    console.error("Error al obtener plantillas:", error);
    return NextResponse.json({ error: "No se pudieron obtener las plantillas" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  const { response } = await authorizeStaff(req);
  if (response) return response;

  const body = await readBody(req);
  const fields = body && getTemplateFields(body);
  if (!fields) return NextResponse.json({ error: "Datos de plantilla inválidos" }, { status: 400 });

  try {
    await connect();
    const plantilla = await Plantilla.create(fields);
    return NextResponse.json({ message: "Plantilla creada", id: plantilla._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar plantilla:", error);
    return NextResponse.json({ error: "No se pudo guardar la plantilla" }, { status: 500 });
  }
};

export const PUT = async (req: Request) => {
  const { response } = await authorizeStaff(req);
  if (response) return response;

  const body = await readBody(req);
  if (!body || typeof body._id !== "string" || !ObjectId.isValid(body._id)) {
    return NextResponse.json({ error: "ID de plantilla inválido" }, { status: 400 });
  }
  const fields = getTemplateFields(body);
  if (!fields) return NextResponse.json({ error: "Datos de plantilla inválidos" }, { status: 400 });

  try {
    await connect();
    const plantilla = await Plantilla.findByIdAndUpdate(
      body._id,
      { $set: fields },
      { new: true, runValidators: true }
    );
    if (!plantilla) return NextResponse.json({ error: "Plantilla no encontrada" }, { status: 404 });
    return NextResponse.json({ ...plantilla.toObject(), _id: plantilla._id.toString() });
  } catch (error) {
    console.error("Error al actualizar plantilla:", error);
    return NextResponse.json({ error: "No se pudo actualizar la plantilla" }, { status: 500 });
  }
};
