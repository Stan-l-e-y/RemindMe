import qs from 'qs';
import { FacebookTokensResult } from '../../types/oauth/facebook';

export async function getFacebookOAuthTokens({
  code,
}: {
  code: string;
}): Promise<FacebookTokensResult> {
  //
  const url = 'https://graph.facebook.com/v11.0/oauth/access_token';

  const values = {
    code,
    client_id: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET,
    redirect_uri: process.env.NEXT_PUBLIC_FACEBOOK_OAUTH_CALLBACK_URL,
    code_verifier: process.env.CODE_VERIFIER,
  };

  try {
    const res = await fetch(`${url}?${qs.stringify(values)}`, {
      method: 'GET',
    });
    return (await res.json()) as FacebookTokensResult;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
}
/***
Retrieves data in the form of <T> from Facebook's Graph API

@param relativeUrl — The endpoint (Node/Edge)

@param accessToken — The token given by Facebook after successfully logging in

@param fields — Comma seperated string. If specified, will return only these fields from the endpoint

@example
Usage

getFacebookResource<UserPermissionsResult>('4312435/permissions','ASDF7Cndfj12asd','data')

 */
export async function getFacebookResource<T>(
  relativeUrl: string,
  accessToken: string,
  fields?: string
): Promise<T> {
  //return data as T

  const hostUrl = 'https://graph.facebook.com/';
  const fieldsUrl = fields ? `&fields=${fields}` : '';

  try {
    const res = await fetch(
      `${hostUrl}${relativeUrl}?access_token=${accessToken}${fieldsUrl}`,
      {
        method: 'GET',
      }
    );

    return (await res.json()) as Promise<T>;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
}
