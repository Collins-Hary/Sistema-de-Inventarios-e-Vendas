import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api')) {
    return authMiddleware(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
