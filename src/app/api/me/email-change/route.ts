import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import argon2 from "argon2";
import { getActiveSession } from "@/lib/getActiveSession";
import connect from "@/lib/db";
import User from "@/lib/models/user";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const session = await getActiveSession(req);
  const userId = session?.user?.id?.toString();
  if (!session || !userId || !ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (session.user?.rol !== "user") {
    return NextResponse.json({ error: "Esta confirmación solo está disponible para alumnos" }, { status: 403 });
  }

  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const { currentPassword, newEmail } = body as Record<string, unknown>;
    if (
      typeof currentPassword !== "string" ||
      currentPassword.length === 0 ||
      currentPassword.length > 128 ||
      typeof newEmail !== "string"
    ) {
      return NextResponse.json({ error: "Ingresá tu contraseña actual y el email nuevo" }, { status: 400 });
    }

    const normalizedEmail = newEmail.trim().toLowerCase();
    if (normalizedEmail.length > 254 || !emailPattern.test(normalizedEmail)) {
      return NextResponse.json({ error: "El email no es válido" }, { status: 400 });
    }

    await connect();
    const user = await User.findById(userId).select("pwd email pendingEmail emailChangeRequestedAt rol");
    if (!user || user.rol !== "user") {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    if (!user.pendingEmail || normalizedEmail !== user.pendingEmail) {
      return NextResponse.json({ error: "El email no coincide con la solicitud pendiente" }, { status: 400 });
    }
    if (
      user.emailChangeRequestedAt &&
      Date.now() - new Date(user.emailChangeRequestedAt).getTime() > 7 * 24 * 60 * 60 * 1000
    ) {
      return NextResponse.json({ error: "La solicitud venció. Pedile al teacher que la genere nuevamente" }, { status: 410 });
    }
    if (!(await argon2.verify(user.pwd, currentPassword))) {
      return NextResponse.json({ error: "La contraseña actual no es correcta" }, { status: 400 });
    }

    const emailInUse = await User.findOne({
      _id: { $ne: user._id },
      $or: [{ email: normalizedEmail }, { pendingEmail: normalizedEmail }],
    }).collation({ locale: "en", strength: 2 }).select("_id");
    if (emailInUse) {
      return NextResponse.json({ error: "El email ya está asociado a otra cuenta" }, { status: 409 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, pendingEmail: normalizedEmail, rol: "user" },
      {
        $set: { email: normalizedEmail },
        $unset: {
          pendingEmail: 1,
          emailChangeRequestedBy: 1,
          emailChangeRequestedAt: 1,
        },
      },
      { new: true, runValidators: true }
    ).select("email");

    if (!updatedUser) {
      return NextResponse.json({ error: "La solicitud cambió. Actualizá la página e intentá de nuevo" }, { status: 409 });
    }

    return NextResponse.json({ message: "Email actualizado", email: updatedUser.email });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "El email ya está asociado a otra cuenta" }, { status: 409 });
    }
    return NextResponse.json({ error: "No se pudo confirmar el cambio de email" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getActiveSession(req);
  const userId = session?.user?.id?.toString();
  if (!session || !userId || !ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (session.user?.rol !== "user") {
    return NextResponse.json({ error: "Esta acción solo está disponible para alumnos" }, { status: 403 });
  }

  try {
    await connect();
    await User.updateOne(
      { _id: userId, rol: "user" },
      {
        $unset: {
          pendingEmail: 1,
          emailChangeRequestedBy: 1,
          emailChangeRequestedAt: 1,
        },
      }
    );
    return NextResponse.json({ message: "Solicitud cancelada" });
  } catch {
    return NextResponse.json({ error: "No se pudo cancelar la solicitud" }, { status: 500 });
  }
}
