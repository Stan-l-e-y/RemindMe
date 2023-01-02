import { verifyJwt, signJwt } from '../lib/jwt.utils';
import { get } from 'lodash';

// TODO: remove this file once i finish setting up the proxy, im using this temp
export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  try {
    const { decoded } = await verifyJwt(refreshToken, 'REFRESH_PUBLIC_KEY');

    if (!decoded || !get(decoded, 'session')) return false;

    const accessTokenTtl = (process.env['accessTokenTtl'] as string) ?? '15m';

    const accessToken = await signJwt(
      { decoded },
      'ACCESS_TOKEN_PRIVATE_KEY',
      undefined,
      accessTokenTtl
    );

    return accessToken;
  } catch (error: any) {
    throw new Error(error);
  }
}
