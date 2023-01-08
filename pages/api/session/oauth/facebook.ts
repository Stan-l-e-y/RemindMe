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
  FacebookUserPermissionsResult,
  FacebookUserPermissionResult,
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

      //use access_token to make request to user permissions endpoint

      const userPermissions =
        await getFacebookResource<FacebookUserPermissionsResult>(
          'me/permissions',
          access_token
        );

      //find email permission, check for status == 'granted

      const emailPermission: FacebookUserPermissionResult | undefined =
        userPermissions.data.find(
          (permission) => permission.permission == 'email'
        );

      if (!emailPermission || emailPermission.status != 'granted') {
        console.log('Email Permission not granted, redirecting to login...');
        res.redirect(307, '/login');
      }

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
