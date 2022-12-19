import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// import { AnyZodObject } from 'zod/lib';

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
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

// const validate =
//   (schema: AnyZodObject) => (req: NextRequest, res: NextResponse) => {
//     try {
//       schema.parse({
//         body: req.body,
//         params: req.nextUrl.searchParams,
//       });
//       // return NextResponse.next();
//     } catch (error: any) {
//       return new NextResponse(
//         JSON.stringify({ success: false, message: error }),
//         { status: 40, headers: { 'content-type': 'application/json' } }
//       );
//     }
//   };
// export const config = {
//   matcher: '/api/:path*',
// };
