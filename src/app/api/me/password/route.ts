import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import argon2 from "argon2";
import { getActiveSession } from "@/lib/getActiveSession";
import connect from "@/lib/db";
import User from "@/lib/models/user";

export async function PUT(req: Request) {
  const session = await getActiveSession(req);
  const userId = session?.user?.id?.toString();

  if (!userId || !ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body ?? {};

    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return NextResponse.json({ error: "Datos de contraseña inválidos" }, { status: 400 });
    }
    if (newPassword.length < 8 || newPassword.length > 128) {
      return NextResponse.json({ error: "La contraseña nueva debe tener entre 8 y 128 caracteres" }, { status: 400 });
    }

    await connect();
    const user = await User.findById(userId).select("pwd");
    if (!user || !(await argon2.verify(user.pwd, currentPassword))) {
      return NextResponse.json({ error: "La contraseña actual no es correcta" }, { status: 400 });
    }

    user.pwd = await argon2.hash(newPassword);
    await user.save();

    return NextResponse.json({ message: "Contraseña actualizada" });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
