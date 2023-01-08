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
  //TODO:i have to check if they declined permissions to email, if they did send back error saying that its needed for the app
  //once i get the token back, "https://graph.facebook.com/USER-ID/permissions?access_token=ACCESS-TOKEN"
  //also try  https://graph.facebook.com/me/permissions?access_token=ACCESS-TOKEN
  //also "https://graph.facebook.com/USER-ID/permissions?access_token=ACCESS-TOKEN&permission=email&status=granted"
  //or swap permission with public_profile
  //Account can have a new field called id_token
}
