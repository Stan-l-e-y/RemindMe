import Cookies from 'cookies';
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from '../../../../lib/tokenOptions';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === 'GET') {
    //after consent (successful) screen, google redirects to this route with an access code
    const code = req.query.code as string;

    try {
      //
    } catch (error: any) {
      //
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
