import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createUserSchema } from './types/user.schema';

import { AnyZodObject } from 'zod/lib';

export default function middleware(req: NextRequest, res: NextResponse) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/api/user/create')) {
    // validate(createUserSchema)(req, res);
    //CANNOT ALTER RESPONSES BODY UGHH
    try {
      createUserSchema.parse({
        body: req.body,
        params: req.nextUrl.searchParams,
      });
      return NextResponse.next();
    } catch (error: any) {
      console.log(req.body);
      return NextResponse.json(
        { success: false, message: error },
        { status: 422, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // const PUBLIC_FILE = /\.(.*)$/;
  // if (
  //   pathname.startsWith('/_next') || // exclude Next.js internals
  //   pathname.startsWith('/api') || //  exclude all API routes
  //   pathname.startsWith('/static') || // exclude static files
  //   PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  // ) {
  //   return NextResponse.next();
  // }

  return NextResponse.next();
}
