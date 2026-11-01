import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth0";
import connect from "@/lib/db";
import User from "@/lib/models/user";
import { ObjectId } from "mongodb";

/** Returns a session only while its account remains active in the database. */
export async function getActiveSession(req?: Request): Promise<Session | null> {
  try {
    const session = req
      ? await getServerSession({ req, ...authOptions })
      : await getServerSession(authOptions);
    const id = session?.user?.id?.toString();

    if (!session || !id || !ObjectId.isValid(id)) {
      return null;
    }

    await connect();
    const user = await User.findById(id).select("_id rol habilitado bloqueado");
    if (!user || user.habilitado !== true || user.bloqueado === true) {
      return null;
    }

    return {
      ...session,
      user: {
        ...session.user,
        id: user._id.toString(),
        rol: user.rol,
      },
    };
  } catch {
    return null;
  }
}
