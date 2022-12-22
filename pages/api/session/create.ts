import type { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import validate from '../../../lib/validateResource';
import {
  createSessionSchema,
  SessionInput,
} from '../../../types/session.schema';
import { validatePassword } from '../../../services/user';
import { createSession } from '../../../services/session';
import { signJwt } from '../../../lib/jwt.utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === 'POST') {
    try {
      const sessionReq = validate(createSessionSchema)(req);

      const user = await validatePassword(sessionReq as SessionInput);

      if (!user) {
        res
          .status(401)
          .json({ error: 'Invalid credentials, wrong email or password' });
      } else {
        const session = await createSession(
          user.id,
          req.headers['user-agent'] || ''
        );

        const accessTokenTtl =
          (process.env['accessTokenTtl'] as string) ?? '15m';

        const refreshTokenTtl =
          (process.env['refreshTokenTtl'] as string) ?? '1y';

        const accessToken = await signJwt(
          { userId: user.id, sessionId: session.id },
          'accessTokenPrivateKey',
          { expiresIn: accessTokenTtl }
        );

        const refreshToken = await signJwt(
          { userId: user.id, sessionId: session.id },
          'refreshTokenPrivateKey',
          { expiresIn: refreshTokenTtl }
        );

        res.status(200).json({
          accessToken,
          refreshToken,
        });
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(409).json({ error: error.message });
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
