import type { NextApiRequest, NextApiResponse } from 'next';
import { findSessions } from '../../../services/session';
import { verifyJwt } from '../../../lib/jwt.utils';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //TODO: always have to get from header first because if the middleware reissued a new token, itll be in the header
  //untill i figure out how to set the cookie in the request of the middleware
  const accesstoken =
    (res.getHeader('x-access-token') as string) ||
    (req.cookies.accessToken as string);

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
