import type { NextApiRequest, NextApiResponse } from 'next';
import { findSessions } from '../../../services/session';
import jose from 'jose';
import { IJWTPayload } from '../../../lib/jwt.utils';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accesstoken =
    req.headers.authorization || (req.cookies.accessToken as string);

  const { user } = jose.decodeJwt(accesstoken) as IJWTPayload;

  const sessions = await findSessions({ userId: user.id, valid: true });

  return res.status(200).json(sessions);
}
