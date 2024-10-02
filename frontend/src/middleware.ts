import { get } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get('authToken');
    const token = get(tokenCookie, 'value');

    const publicPaths = ['/sign-in', '/sign-up', '/forgot-password'];
    const isPublicPath = publicPaths.includes(req.nextUrl.pathname);

    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
