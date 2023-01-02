import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === 'DELETE') {
    try {
      //TODO:
      //get the jwt cookie
      //get the session id from the jwt cookie
      //update the session to be invalid
      //delete the jwt cookie, set new cookie with same name(the access token cookie) but with maxAge = 0
      //essentially, log out
      //return accessTokens and refreshTokens as null or idk
    } catch (error) {
      //
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
