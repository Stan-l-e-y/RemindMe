import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(req: NextRequest, res: NextResponse) {
  return NextResponse.next();
}

// validate(createUserSchema)(req, res);
