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
import Cookies from 'cookies';

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
          { ...user, session: session.id },
          'ACCESS_TOKEN_PRIVATE_KEY',
          undefined,
          accessTokenTtl
        );

        const refreshToken = await signJwt(
          { ...user, session: session.id },
          'REFRESH_PRIVATE_KEY',
          undefined,
          refreshTokenTtl
        );

        const cookies = new Cookies(req, res);
        cookies.set('accessToken', accessToken, {
          maxAge: 900000, // 15 mins
          httpOnly: true,
          domain: 'localhost',
          path: '/',
          sameSite: 'strict',
          secure: false,
        });

        cookies.set('refreshToken', refreshToken, {
          maxAge: 3.154e10, // 1 year
          httpOnly: true,
          domain: 'localhost',
          path: '/',
          sameSite: 'strict',
          secure: false,
        });

        //if client cannot handle cookies, send tokens in response body
        //then the client will take this json response and store it in localstorage or however they want to store it and use it for future requests in the Authorization header

        //if the client is on a separete domain and has to do the above. Then in theory, the client should have a middleware that checks if new tokens are set in the headers via the server middleware and then update the localstorage with the new tokens
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
