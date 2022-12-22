import type { NextApiRequest, NextApiResponse } from 'next';
import { findSessions } from '../../../services/session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.headers['userId']; //no, get from header

  const sessions = await findSessions({ userId: userId, valid: true });

  return res.status(200).json(sessions);
}
