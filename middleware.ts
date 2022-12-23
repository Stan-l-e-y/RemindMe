import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './lib/jwt.utils';

export default async function middleware(req: NextRequest, res: NextResponse) {
  //maybe as well  pathname post /login

  if (
    req.nextUrl.pathname !== '/login' &&
    req.nextUrl.pathname !== '/register' &&
    req.nextUrl.pathname !== '/api/session/create'
  ) {
    const userId = req.headers.get('userId');
    if (!userId) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  const accessToken = req.headers
    .get('Authorization')
    ?.replace(/^Bearer\s/, ''); //or try lodash get

  if (!accessToken) {
    return NextResponse.next();
  }

  const { decoded, expired } = await verifyJwt(
    accessToken,
    'ACCESS_TOKEN_PUBLIC_KEY'
  );

  if (decoded) {
    res.headers.set('userId', String(decoded.userId));
    return NextResponse.next();
  }

  return NextResponse.next();
}
