import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request) {
  const sessionCookie = request.cookies.get('session');
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!sessionCookie) return NextResponse.redirect(new URL('/login', request.url));
    const session = await decrypt(sessionCookie.value);
    if (!session || session.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/employee')) {
    if (!sessionCookie) return NextResponse.redirect(new URL('/login', request.url));
    const session = await decrypt(sessionCookie.value);
    if (!session || (session.role !== 'employee' && session.role !== 'admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/employee/:path*'],
};
