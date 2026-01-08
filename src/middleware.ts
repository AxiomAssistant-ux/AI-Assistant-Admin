import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
}


// // middleware.ts
// import { NextRequest, NextResponse } from 'next/server'

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   // Redirect root to org user sign-in
//   if (pathname === '/') {
//     return NextResponse.redirect(new URL('/auth/sign-in', request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public files (images, etc)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }