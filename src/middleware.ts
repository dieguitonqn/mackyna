import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from "next-auth/middleware"

// export { default } from "next-auth/middleware";
// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }
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