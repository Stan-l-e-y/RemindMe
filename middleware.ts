import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './lib/jwt.utils';
import { reIssueAccessToken } from './services/session';

export default async function middleware(req: NextRequest, res: NextResponse) {
  //TODO: What im looking for to test
  //when i try to access localhost:3000/ without being logged in, i want to be redirected to localhost:3000/login, check for response code 302/redirect
  //when i create a session/log in, i want the response to set the token cookies as well as return the cookies in the response body
  //when im logged in, i want to be able to access localhost:3000/ and get a 200 response with the html page
  //remove the cookies or just log in again to get new access tokens but this time, expire the access token right away to test if the refresh
  //token will reissue and set a new access token. Login->returns and sets expired access cookie but valid refresh, try to access localhost:3000/
  //if it takes me straight to the index page that means it worked (and it reissued one/set the cookie), if it takes me to the login page then something went wrong

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
