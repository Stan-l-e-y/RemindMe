import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './lib/jwt.utils';
import { accessTokenCookieOptions } from './lib/tokenOptions';
import { reIssueAccessToken } from './services/session';

export default async function middleware(req: NextRequest, res: NextResponse) {
  //TODO: need to remove middleware being run on the /api/session/oauth/*
  //TODO: Implement OAuth2.0 authentication with Google, Facebook
  //TODO: Document OAuth?
  if (req.nextUrl.pathname == '/login' || req.nextUrl.pathname == '/register') {
    const accessToken =
      req.cookies.get('accessToken')?.value ||
      req.headers.get('Authorization')?.replace(/^Bearer\s/, ''); //or try lodash get

    if (!accessToken) {
      return NextResponse.next();
    }
    const { decoded, expired } = await verifyJwt(
      accessToken,
      'ACCESS_TOKEN_PUBLIC_KEY'
    );

    if (!decoded) {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  if (
    req.nextUrl.pathname !== '/login' &&
    req.nextUrl.pathname !== '/register' &&
    req.nextUrl.pathname !== '/api/session/create' &&
    req.nextUrl.pathname !== '/api/user/create'
  ) {
    const url = req.nextUrl.clone();

    const accessToken =
      req.cookies.get('accessToken')?.value ||
      req.headers.get('Authorization')?.replace(/^Bearer\s/, ''); //or try lodash get

    const refreshToken =
      req.cookies.get('refreshToken')?.value ||
      req.headers.get('headers.x-refresh');

    if (!accessToken) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    const { decoded, expired } = await verifyJwt(
      accessToken,
      'ACCESS_TOKEN_PUBLIC_KEY'
    );

    if (decoded) {
      return NextResponse.next();
    }

    if (expired && refreshToken) {
      const newAccessToken = await reIssueAccessToken({ refreshToken });
      const requestHeaders = new Headers(req.headers);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      if (newAccessToken) {
        //if the client is on a separete domain cannot set cookies therefore has to resolve to taking the cookies from the header. Then in theory, the client should have a middleware that checks if new tokens are set in the headers via the line below and then update the localstorage with the new tokens
        response.headers.set('x-access-token', newAccessToken);

        response.cookies.set(
          'accessToken',
          newAccessToken,
          accessTokenCookieOptions
        );
        //TODO: this line below doesnt work, figure out a way to set the cookie in the request of the middleware
        requestHeaders.set('x-access-token', newAccessToken);
      }

      const { decoded } = await verifyJwt(
        newAccessToken as string,
        'ACCESS_TOKEN_PUBLIC_KEY'
      );

      if (decoded) {
        return response;
      }
    }
    console.log('failed to verify, redirecting to login...');
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
export const config = {
  matcher: '/((?!favicon.ico|_next|api/session/oauth/*).*)',
};
