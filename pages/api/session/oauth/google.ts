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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === 'GET') {
    //after consent (successful) screen, Google redirects to this route with an access code
    const code = req.query.code as string;

    try {
      //try and get the ID and Access tokens from Googles auth server
      const { id_token, access_token } = await getGoogleOAuthTokens({ code });
      //get user (info) from Googles resource server with the ID and Access tokens
      const googleUser = await getGoogleUser({ id_token, access_token });
      console.log({ googleUser }); //so far so good
      if (!googleUser.verified_email) {
        return res.status(403).send('Google account is not verified');
      }
      //update or create the user in our database, type: oauth, provider: Google, first_name: googleUser.given_name, last_name: googleUser.family_name
      //TODO: Maybe not upsert user, upsert account AND user, the update on user will not update anything, is user not exist, make one
      //so maybe i dont need upsert, if not found, create. TODO: FIX PRISMA DB PUSH IN NPM SCRIPT
      //
      //create a session
      //
      //create Access and Refresh tokens for RemindMe
      //
      //set cookies for the tokens
      //
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
