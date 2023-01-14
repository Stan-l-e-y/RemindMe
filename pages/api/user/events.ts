import { findEvents } from '@/services/event';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyJwt } from '../../../lib/jwt.utils';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accesstoken =
    (res.getHeader('x-access-token') as string) ||
    (req.cookies.accessToken as string);

  const { method } = req;

  if (method === 'GET') {
    try {
      const { decoded } = await verifyJwt(
        accesstoken,
        'ACCESS_TOKEN_PUBLIC_KEY'
      );

      if (decoded) {
        const events = await findEvents({
          userId: decoded.id,
        });

        return res.status(200).json(events);
      }
      return res.status(401).json({ error: 'Unauthorized' });
    } catch (error: any) {
      throw new Error(error);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
