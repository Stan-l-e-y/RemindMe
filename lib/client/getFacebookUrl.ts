export default function getFacebookUrl(code_challenge: string) {
  const rootUrl = 'https://www.facebook.com/v15.0/dialog/oauth';

  const options = {
    redirect_uri: process.env.NEXT_PUBLIC_FACEBOOK_OAUTH_CALLBACK_URL as string,
    client_id: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID as string,
    response_type: 'code',
    scope: 'openid,email',
    nonce: process.env.NEXT_PUBLIC_NONCE as string,
    state: process.env.NEXT_PUBLIC_OAUTH_STATE as string,
    code_challenge: code_challenge,
    code_challenge_method: 'S256',
    auth_type: 'rerequest',
  };

  const queryString = new URLSearchParams(options);

  return `${rootUrl}?${queryString.toString()}`;
}
