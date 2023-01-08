import Cookies from 'cookies';
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from '../../../../lib/tokenOptions';
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleTokensResult } from '../../../../types/oauth/google';
import {
  getGoogleOAuthTokens,
  getGoogleUser,
} from '../../../../services/oauth/google';

import { findAndUpdateUser } from '../../../../services/user';
import {
  createAccount,
  findAndUpdateAccount,
} from '../../../../services/account';
import { createSession } from '../../../../services/session';
import { signJwt } from '../../../../lib/jwt.utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === 'GET') {
    //after consent (successful) screen, Google redirects to this route with an access code
    const code = req.query.code as string;

    try {
      //try and get the ID and Access tokens from Googles auth server (TODO: later on might need to also get the refresh_token)
      //TODO: if we're only USING A PROVIDER FOR AUTHENTICATION WE DONT NEED THE ACCESS TOKEN, DECODE THE ID TOKEN (OPENID) AND USE THAT TO STORE USER
      //google has the email, full name and profile pic on their jwt. We can also store their id_token in our db
      //we also need to validate the jwt that google sent us (not rly important cuz its a server-server connection between us and google)
      const { id_token, access_token } = await getGoogleOAuthTokens({ code });
      //get user (info) from Googles resource server with the ID and Access tokens

      const googleUser = await getGoogleUser({ id_token, access_token });

      if (!googleUser.verified_email) {
        return res.status(403).send('Google account is not verified');
      }
      //If user found then return user, else create the user in our database
      // TODO: FIX PRISMA DB PUSH IN NPM SCRIPT

      const user = await findAndUpdateUser(
        { email: googleUser.email },
        {},
        {
          email: googleUser.email,
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          picture: googleUser.picture || '',
        }
      );

      //TODO: Might also need to store their access and refresh tokens. That way if theyre signed in with google but also signed in with facebook to give me
      //access to their birthdays, I can look up their account by userProvider and grab tokens from there

      //upsert oauth account in db, not updating anything if found. If not found, create new account
      //Finding by userProvider which is a compound key derived from userId and provider
      await findAndUpdateAccount(
        {
          userProvider: {
            userId: user.id,
            provider: 'GOOGLE',
          },
        },
        {},
        {
          userId: user.id,
          provider: 'GOOGLE',
          type: 'oauth',
        }
      );

      //create a session
      const session = await createSession(
        user.id,
        req.headers['user-agent'] || ''
      );
      //create Access and Refresh tokens for RemindMe
      const accessTokenTtl = (process.env['accessTokenTtl'] as string) ?? '15m';

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
      //set cookies for the tokens
      const cookies = new Cookies(req, res);
      cookies.set('accessToken', accessToken, accessTokenCookieOptions);

      cookies.set('refreshToken', refreshToken, refreshTokenCookieOptions);
      //redirect back to "/" meaning our home page, since Google sent a get request here which naturally return any html
      res.redirect(307, '/');
    } catch (error: any) {
      throw new Error(error);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
