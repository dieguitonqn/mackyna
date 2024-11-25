import NextAuth from "next-auth"

import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import User from "@/lib/models/user";

import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import connect from "@/lib/db";




const handler = NextAuth({
  // adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string

    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
      
      
    })


  ],
  callbacks:{
    async session({ session, token, user }) {
      // Suponemos que el token contiene propiedades 'accessToken' y 'id'
      await connect()
      
      // Suponiendo que tienes un modelo de usuario llamado 'User' con un campo 'role'
      const userWithRole = await User.findOne({ email: session.user.email });
      
      // Si encontramos al usuario en la base de datos, agregamos su rol a la sesión
      if (userWithRole) {
        session.user.rol = userWithRole.rol;
      }
      console.log(session.user.rol);
      return session;
      
    }
  }

})

export { handler as GET, handler as POST }  