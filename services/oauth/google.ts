import qs from 'qs';
import { GoogleTokensResult, GoogleUserResult } from '../../types/oauth/google';

export async function getGoogleOAuthTokens({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult> {
  //
  const url = 'https://oauth2.googleapis.com/token';

  const values = {
    code,
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CALLBACK_URL,
    grant_type: 'authorization_code',
  };

  try {
    const res = await fetch(`${url}?${qs.stringify(values)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return (await res.json()) as GoogleTokensResult;
  } catch (error: any) {
    console.error(error.response.data.error);
    throw new Error(error.message);
  }
}

export async function getGoogleUser({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<GoogleUserResult> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return (await res.json()) as GoogleUserResult;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
