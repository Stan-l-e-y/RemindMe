import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './lib/jwt.utils';
import { reIssueAccessToken } from './services/session';

export default async function middleware(req: NextRequest, res: NextResponse) {
  //maybe as well  pathname post /login
  //TODO:
  //probably combine the deserizileUser and require user into one, for now called Auth
  //run this Auth on every route except the login and register
  //if not Auth, redirect back to login page
  //not Auth, in his code means that the requireUser returns a 403

  if (
    req.nextUrl.pathname !== '/login' &&
    req.nextUrl.pathname !== '/register' &&
    req.nextUrl.pathname !== '/api/session/create'
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

      if (newAccessToken) {
        res.headers.set('x-access-token', newAccessToken);

        res.cookies.set('accessToken', newAccessToken, {
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
        return NextResponse.next();
      }
    }

    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
