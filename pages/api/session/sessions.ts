import type { NextApiRequest, NextApiResponse } from 'next';
import { findSessions } from '../../../services/session';
import jose from 'jose';
import { IJWTPayload, verifyJwt } from '../../../lib/jwt.utils';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accesstoken =
    req.headers.authorization || (req.cookies.accessToken as string);

  try {
    const { decoded } = await verifyJwt(accesstoken, 'ACCESS_TOKEN_PUBLIC_KEY');

    if (decoded) {
      const sessions = await findSessions({
        userId: decoded.id,
        valid: true,
      });

      return res.status(200).json(sessions);
    }
    return res.status(401).json({ error: 'Unauthorized' });
  } catch (error: any) {
    throw new Error(error);
  }
}
