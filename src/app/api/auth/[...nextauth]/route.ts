import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";

import User from "@/lib/models/user";

import CredentialsProvider from "next-auth/providers/credentials";
import connect from "@/lib/db";
import argon2 from "argon2";
import logger from "@/lib/logger";
// import Pago from "@/lib/models/pagos";

const handler = NextAuth({
  // adapter: MongoDBAdapter(client),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith@mail.com" },
        password: { label: "Password", type: "password" },
      },
      //
      async authorize(
        credentials: { email?: string; password?: string } | undefined
      ) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Email o contraseña no proporcionados.");
            return null;
          }

          // console.log("El email ingresado es:", credentials.email);

          // Conectar a la base de datos
          await connect();

          // Buscar al usuario en la base de datos
          const isUser = await User.findOne({ email: credentials.email });
          if (!isUser) {
            console.error("Usuario no encontrado.");
            return null;
          }

          // console.log("Usuario encontrado:", isUser);

          // Verificar la contraseña
          const isPasswordValid = await argon2.verify(
            isUser.pwd,
            credentials.password
          );
          if (!isPasswordValid) {
            console.error("Contraseña incorrecta.");
            return null;
          }

          // Devolver el usuario autenticado
          const user = {
            id: isUser._id,
            name: `${isUser.nombre} ${isUser.apellido}`,
            email: isUser.email,
          };
          return user;
        } catch (error) {
          console.error("Error en la autorización:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID as string,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
    // }),
  ],
  callbacks: {
    // Verificar si el usuario está registrado antes de permitirle iniciar sesión
    async signIn({ user }) {
      try {
        await connect();

        // Verificar si el usuario existe en la base de datos
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          logger.warn(
            `Intento de acceso por usuario no registrado: ${user.email}`
          );
          return false;
        }

        // Verificar si el usuario está habilitado y no está bloqueado
        if (!existingUser.habilitado || existingUser.bloqueado) {
          logger.warn(
            `Intento de acceso por usuario no habilitado o bloqueado: ${user.email}`
          );
          return false;
        }
        // ============ Lógica para verificar el pago ============
        // Verificar si el usuario tiene un pago registrado
        // const lastPayment = await Pago.findOne({
        //   userId: existingUser._id,
        // }).sort({ createdAt: -1 });
        // if (!lastPayment) {
        //   logger.warn(`Usuario sin historial de pagos: ${user.email}`);
        //   return false;
        // }

        // const currentDate = new Date();
        // const paymentDate = new Date(lastPayment.createdAt);

        // // Crear fecha límite (día 10 del mes siguiente al pago)
        // const limitDate = new Date(paymentDate);
        // limitDate.setMonth(limitDate.getMonth() + 1);
        // limitDate.setDate(10);

        // // Permite acceso si está dentro del mes de pago o antes del día 10 del mes siguiente
        // if (currentDate <= limitDate) {
        //   return true;
        // }

        // logger.warn(`Acceso denegado por pago vencido: ${user.email}`);
        // return false;


        // ============ Fin de la lógica de pago ============


        //============ Verificar el vencimiento si el pago no es mensual ============
        // if(lastPayment.descripcion ==="Clase Individual" ){ 
        //   const expirationDate = new Date(lastPayment.createdAt);
        //   expirationDate.setDate(expirationDate.getDate() + 1);
        //   if (currentDate > expirationDate) {
        //     logger.warn(`Acceso denegado por pago vencido: ${user.email}`);
        //     return false;
        //   }
        // } else if (lastPayment.descripcion ==="Semana") {
        //   const expirationDate = new Date(lastPayment.createdAt);
        //   expirationDate.setDate(expirationDate.getDate() + 7);
        //   if (currentDate > expirationDate) {
        //     logger.warn(`Acceso denegado por pago vencido: ${user.email}`);
        //     return false;
        //   }
        // } else if (lastPayment.descripcion ==="Quincena") {
        //   const expirationDate = new Date(lastPayment.createdAt);
        //   expirationDate.setDate(expirationDate.getDate() + 14);
        //   if (currentDate > expirationDate) {
        //     logger.warn(`Acceso denegado por pago vencido: ${user.email}`);
        //     return false;
        //   }
        // }
        //============ Fin de la verificación de vencimiento ============

        return true;
      } catch (error) {
        logger.error(`Error en verificación de acceso: ${error}`);
        return false;
      }
    },
    async session({ session }) {
      await connect();
      const userWithRole = await User.findOne({
        email: session.user.email,
        habilitado: true,
        bloqueado: false,
      });

      if (!userWithRole) {
        throw new Error("Usuario no encontrado o no autorizado");
      }

      session.user.rol = userWithRole.rol;
      session.user.id = userWithRole._id;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
