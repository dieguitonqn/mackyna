import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getActiveSession } from "@/lib/getActiveSession";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { parseDateOnlyToUTC } from "@/utils/dateOnly";

const profileFields = [
  "nombre",
  "apellido",
  "genero",
  "fecha_nacimiento",
  "localidad",
  "telefono",
  "altura",
  "objetivo",
  "lesiones",
  "redes",
] as const;

const getSessionUserId = async (req?: Request) => {
  const session = await getActiveSession(req);
  const id = session?.user?.id?.toString();

  if (!id || !ObjectId.isValid(id)) {
    return null;
  }

  return id;
};

const toProfileResponse = (user: Record<string, unknown>) => ({
  _id: user._id ? String(user._id) : undefined,
  nombre: user.nombre,
  apellido: user.apellido,
  genero: user.genero,
  fecha_nacimiento: user.fecha_nacimiento,
  localidad: user.localidad,
  telefono: user.telefono,
  email: user.email,
  pendingEmail: user.pendingEmail ?? null,
  altura: user.altura,
  objetivo: user.objetivo,
  lesiones: user.lesiones,
  redes: user.redes,
});

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await connect();
    const user = await User.findById(userId)
      .select(profileFields.join(" ") + " email pendingEmail")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(toProfileResponse(user as Record<string, unknown>));
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const userId = await getSessionUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const update: Record<string, unknown> = {};
    const unset: Record<string, 1> = {};
    for (const field of profileFields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        update[field] = body[field];
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No hay datos para actualizar" }, { status: 400 });
    }

    if ("fecha_nacimiento" in update) {
      if (update.fecha_nacimiento === null || update.fecha_nacimiento === "") {
        update.fecha_nacimiento = null;
      } else if (typeof update.fecha_nacimiento === "string") {
        const date = parseDateOnlyToUTC(update.fecha_nacimiento);
        if (!date) {
          return NextResponse.json({ error: "Fecha de nacimiento inválida" }, { status: 400 });
        }
        update.fecha_nacimiento = date;
      } else {
        return NextResponse.json({ error: "Fecha de nacimiento inválida" }, { status: 400 });
      }
    }

    if ("genero" in update) {
      const allowedGenders = ["", "Masculino", "Femenino", "Otro"];
      if (typeof update.genero !== "string" || !allowedGenders.includes(update.genero)) {
        return NextResponse.json({ error: "Género inválido" }, { status: 400 });
      }
      if (update.genero === "") {
        delete update.genero;
        unset.genero = 1;
      }
    }

    if ("altura" in update) {
      const height = Number(update.altura);
      if (!Number.isFinite(height) || height < 0 || height > 3) {
        return NextResponse.json({ error: "Altura inválida" }, { status: 400 });
      }
      update.altura = height;
    }

    for (const field of ["nombre", "apellido", "localidad", "telefono", "objetivo", "lesiones"] as const) {
      if (field in update && update[field] !== undefined) {
        if (typeof update[field] !== "string" || update[field].length > 500) {
          return NextResponse.json({ error: `Campo inválido: ${field}` }, { status: 400 });
        }
        update[field] = update[field].trim();
      }
    }

    if ("redes" in update) {
      const redes = update.redes;
      if (!redes || typeof redes !== "object" || Array.isArray(redes)) {
        return NextResponse.json({ error: "Redes inválidas" }, { status: 400 });
      }
      const submitted = redes as Record<string, unknown>;
      update.redes = {
        Facebook: typeof submitted.Facebook === "string" ? submitted.Facebook.slice(0, 300) : "",
        Instagram: typeof submitted.Instagram === "string" ? submitted.Instagram.slice(0, 300) : "",
        Twitter: typeof submitted.Twitter === "string" ? submitted.Twitter.slice(0, 300) : "",
      };
    }

    await connect();
    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(Object.keys(update).length > 0 ? { $set: update } : {}),
        ...(Object.keys(unset).length > 0 ? { $unset: unset } : {}),
      },
      { new: true, runValidators: true }
    ).select(profileFields.join(" ") + " email").lean();

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(toProfileResponse(user as Record<string, unknown>));
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
