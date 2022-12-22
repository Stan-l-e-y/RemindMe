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
      return NextResponse.redirect('/login');
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
    'accessTokenPublicKey'
  );

  if (decoded) {
    res.headers.set('userId', String(decoded.userId));
    return NextResponse.next();
  }

  return NextResponse.next();
}
