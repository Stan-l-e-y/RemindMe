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
    //after consent (successful) screen, Google redirects to this route with an access code
    const code = req.query.code as string;

    try {
      //try and get the ID and Access tokens from Googles auth server
      //
      //get user (info) from Googles resource server with the ID and Access tokens
      //
      //update or create the user in our database
      //
      //create a session
      //
      //create Access and Refresh tokens for RemindMe
      //
      //set cookies for the tokens
      //
      //redirect back to "/" meaning our home page, since Google sent a get request here which naturally return any html
    } catch (error: any) {
      //
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
