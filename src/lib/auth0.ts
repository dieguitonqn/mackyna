import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import User from "@/lib/models/user";
import connect from "@/lib/db";
import argon2 from "argon2";
import logger from "@/lib/logger";
import { recordAdminEvent } from "@/lib/adminEvents";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith@mail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          await connect();
          const user = await User.findOne({ email: credentials.email });
          if (!user || !(await argon2.verify(user.pwd, credentials.password))) {
            await recordAdminEvent({ type: "login_failed", action: "credentials" });
            return null;
          }

          return {
            id: user._id.toString(),
            name: `${user.nombre} ${user.apellido}`,
            email: user.email,
          };
        } catch (error) {
          logger.error("Error en la autorización:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        await connect();
        const activeUser = await User.findOne({
          email: user.email,
          habilitado: true,
          bloqueado: false,
        }).select("_id");
        if (activeUser) {
          await recordAdminEvent({ type: "login", actorId: activeUser._id.toString(), action: "sign_in" });
        } else {
          await recordAdminEvent({ type: "login_failed", action: "account_unavailable" });
        }
        return Boolean(activeUser);
      } catch (error) {
        logger.error("Error en verificación de acceso:", error);
        return false;
      }
    },
    async session({ session }) {
      await connect();
      const activeUser = await User.findOne({
        email: session.user?.email,
        habilitado: true,
        bloqueado: false,
      }).select("_id rol telefono");

      if (!activeUser) {
        throw new Error("Usuario no encontrado o no autorizado");
      }

      session.user.id = activeUser._id.toString();
      session.user.rol = activeUser.rol;
      session.user.telefono = activeUser.telefono;
      return session;
    },
  },
  events: {
    async signOut({ token, session }) {
      const actorId = session?.user?.id ?? token?.sub ?? null;
      await recordAdminEvent({ type: "logout", actorId: actorId ? String(actorId) : null, action: "sign_out" });
    },
  },
};
