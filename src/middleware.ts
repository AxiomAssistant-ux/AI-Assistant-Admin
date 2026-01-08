// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root only
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Run middleware on everything EXCEPT:
     * - auth routes
     * - api routes
     * - next internals
     * - static files
     */
    '/((?!auth|api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
