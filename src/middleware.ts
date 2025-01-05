
import { withAuth } from "next-auth/middleware"

export const config = {
    matcher:
        [
            '/portalProfes/:path*',
            '/dashboard:path*',
            '/portalAlumnos/:path*'
            // '/api/:path*'
        ]
}

export default withAuth({
    // Matches the pages config in `[...nextauth]`
    pages: {
      signIn: "/login",
    //   error: "/error",
    },
  })