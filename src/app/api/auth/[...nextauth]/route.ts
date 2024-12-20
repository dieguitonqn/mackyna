
import NextAuth from "next-auth"

import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import User from "@/lib/models/user";

import CredentialsProvider from "next-auth/providers/credentials";
import connect from "@/lib/db";
import argon2 from "argon2"





const handler = NextAuth({

    // adapter: MongoDBAdapter(client),
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "email", type: "text", placeholder: "jsmith@mail.com" },
          password: { label: "Password", type: "password" }
        },
        // 
        async authorize(credentials: { email?: string; password?: string } | undefined) {
          try {
            if (!credentials?.email || !credentials?.password) {
              console.error("Email o contraseña no proporcionados.");
              return null;
            }
  
            console.log("El email ingresado es:", credentials.email);
  
            // Conectar a la base de datos
            await connect();
  
            // Buscar al usuario en la base de datos
            const isUser = await User.findOne({ email: credentials.email });
            if (!isUser) {
              console.error("Usuario no encontrado.");
              return null;
            }
  
            console.log("Usuario encontrado:", isUser);
  
            // Verificar la contraseña
            const isPasswordValid = await argon2.verify(isUser.pwd, credentials.password);
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
        }
  
  
  
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
  
      }),
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID as string,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
      }),
      
  
  
    ],
    callbacks: {
      // Verificar si el usuario está registrado antes de permitirle iniciar sesión
      async signIn({ user }) {
        try {
          await connect();
  
          // Verificar si el usuario existe en la base de datos
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            console.error("Usuario no registrado:", user.email);
            return false; // Denegar acceso si no está registrado
          }
  
          return true; // Permitir acceso si el usuario está registrado
        } catch (error) {
          console.error("Error en el callback signIn:", error);
          return false; // Denegar acceso en caso de error
        }
      },
      async session({ session }) {
        // Suponemos que el token contiene propiedades 'accessToken' y 'id'
        await connect()
  
        // Suponiendo que tienes un modelo de usuario llamado 'User' con un campo 'role'
        const userWithRole = await User.findOne({ email: session.user.email });
  
        // Si encontramos al usuario en la base de datos, agregamos su rol a la sesión
        if (userWithRole) {
          session.user.rol = userWithRole.rol;
          session.user.id=userWithRole._id;
        }
        console.log(session.user.rol);
        return session;
  
      }
    }
  
  })
  
  export { handler as GET, handler as POST }  