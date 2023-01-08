import Cookies from 'cookies';
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from '../../../../lib/tokenOptions';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getFacebookOAuthTokens,
  getFacebookResource,
} from '../../../../services/oauth/facebook';
import * as jose from 'jose';
import {
  FaceBookUserResult,
  FacebookPermissionsResult,
} from '../../../../types/oauth/facebook';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //TODO:i have to check if they declined permissions to email, if they did send back error saying that its needed for the app
  //once i get the token back, "https://graph.facebook.com/USER-ID/permissions?access_token=ACCESS-TOKEN"
  //also try  https://graph.facebook.com/me/permissions?access_token=ACCESS-TOKEN
  //also "https://graph.facebook.com/USER-ID/permissions?access_token=ACCESS-TOKEN&permission=email&status=granted"
  //or swap permission with public_profile
  //Account can have a new field called id_token

  const { method } = req;

  if (method === 'GET') {
    // console.log(req.query.code);
    const code = req.query.code as string;
    try {
      //
      const { access_token, id_token } = await getFacebookOAuthTokens({ code }); //damn it works

      //use tokens to make request to permissions endpoint, if email is allowed continue with req, if not return redirect to login with error

      const permissions = await getFacebookResource<FacebookPermissionsResult>(
        'me/permissions',
        access_token
      );

      console.log(permissions.data[0].status == 'granted');

      //i should be verifying instead of just decoding, fetch the public key from facebook
      const data = jose.decodeJwt(id_token);
      // console.log(data);
      res.redirect(307, '/');
    } catch (error: any) {
      //
      throw new Error(error);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
