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
  FaceBookDecodedIDToken,
} from '../../../../types/oauth/facebook';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        //TODO: return a proper message to the login page indicating why they werent allowed access (email perm required)
        console.log('Email Permission not granted, redirecting to login...');
        res.redirect(307, '/login');
      }

      //Retrieve Facebook's public key (JWK format) and validate the OIDC token as per Facebook's documentation, https://developers.facebook.com/docs/facebook-login/limited-login/token/validating/#jwt-well-formed

      const JWKS = jose.createRemoteJWKSet(
        new URL('https://www.facebook.com/.well-known/oauth/openid/jwks/')
      );

      const { payload }: { payload: FaceBookDecodedIDToken } =
        await jose.jwtVerify(id_token, JWKS, {
          issuer: 'https://www.facebook.com',
          audience: '547647384076575',
        });

      //As per FaceBook's documentation,'This field will not be returned if no valid email address is available.'
      if (!payload.email) {
        console.log(
          'Email missing, must have valid Email to log into RemindMe. Redirecting to login...'
        );
        res.redirect(307, '/login');
      }

      //upsert user
      //

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
