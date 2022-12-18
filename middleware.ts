import { NextResponse, NextRequest } from 'next/server';

import { AnyZodObject } from 'zod/lib';

export default function middleware(req: NextRequest) {
  return NextResponse.next();
}

const validate =
  (schema: AnyZodObject) => (req: NextRequest, res: NextResponse) => {
    try {
      schema.parse({
        body: req.body,
        params: req.nextUrl.searchParams,
      });
      return NextResponse.next();
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({ success: false, message: error }),
        { status: 40, headers: { 'content-type': 'application/json' } }
      );
    }
  };
