import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('authToken')?.value;

    const publicPaths = ['/login', '/register', '/forgot-password'];
    const isPublicPath = publicPaths.includes(req.nextUrl.pathname);

    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
