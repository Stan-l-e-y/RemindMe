import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './lib/jwt.utils';
import { reIssueAccessToken } from './lib/temp-reissue'; //TODO: change this back to import from the session services file

export default async function middleware(req: NextRequest, res: NextResponse) {
  //TODO: create the prisma proxy and use it to call the db on the edge
  //TODO: fix the reissueAccessToken function to work with the prisma proxy and add a logout router/handler

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
      const newAccessToken = await reIssueAccessToken({ refreshToken }); //TODO: bruh this will not work prob, this is calling prisma/db on the edge
      const requestHeaders = new Headers(req.headers);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      if (newAccessToken) {
        //if the client is on a separete domain cannot set cookies therefore has to resolve to taking the cookies from the header. Then in theory, the client should have a middleware that checks if new tokens are set in the headers via the line below and then update the localstorage with the new tokens
        response.headers.set('x-access-token', newAccessToken);

        response.cookies.set('accessToken', newAccessToken, {
          maxAge: 900000, // 15 mins
          httpOnly: true,
          domain: 'localhost',
          path: '/',
          sameSite: 'strict',
          secure: false,
        });
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
  matcher: '/((?!api|_next/static|favicon.ico).*)',
};
