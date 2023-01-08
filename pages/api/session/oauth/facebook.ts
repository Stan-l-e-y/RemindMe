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
import { findAndUpdateUser } from '../../../../services/user';
import { findAndUpdateAccount } from '../../../../services/account';
import { createSession } from '../../../../services/session';
import { signJwt } from '../../../../lib/jwt.utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //TODO: Account can have a new field called id_token

  const { method } = req;

  if (method === 'GET') {
    const code = req.query.code as string;
    try {
      //
      const { access_token, id_token } = await getFacebookOAuthTokens({ code });

      //use access_token to make request to user permissions endpoint, validate that user has granted us access to their email
      const userPermissions =
        await getFacebookResource<FacebookUserPermissionsResult>(
          'me/permissions',
          access_token
        );

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
      const user = await findAndUpdateUser(
        { email: payload.email as string },
        {},
        {
          email: payload.email as string,
          firstName: payload.given_name as string,
          lastName: payload.family_name as string,
          picture: payload.picture || '',
        }
      );

      await findAndUpdateAccount(
        {
          userProvider: {
            userId: user.id,
            provider: 'FACEBOOK',
          },
        },
        {},
        {
          userId: user.id,
          provider: 'FACEBOOK',
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
      //redirect back to "/" meaning our home page, since Facebook sent a get request here which naturally returns html
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
