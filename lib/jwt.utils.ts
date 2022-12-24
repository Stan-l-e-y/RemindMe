import * as jose from 'jose';

export interface IJWTPayload extends jose.JWTPayload {
  userId: number;
  sessionId: number;
}

export async function signJwt(
  payload: jose.JWTPayload,
  keyName: 'ACCESS_TOKEN_PRIVATE_KEY' | 'REFRESH_PRIVATE_KEY',
  options?: jose.JWTPayload
) {
  const alg = process.env['alg'] as string;

  const privateKey = new TextEncoder().encode(process.env[keyName] as string);

  return await new jose.SignJWT({ ...payload, ...(options && options) })
    .setProtectedHeader({ alg })
    .sign(privateKey);
}

export async function verifyJwt(
  token: string,
  keyName: 'ACCESS_TOKEN_PUBLIC_KEY' | 'REFRESH_PUBLIC_KEY'
) {
  //i think this shit finally works... depreciated but its the only way??
  //it decodes a base64 encoded string to a string using utf-8 encoding
  const spki = atob(process.env.ACCESS_TOKEN_PUBLIC_KEY as string);
  console.log(spki);

  const publicKey = await jose.importSPKI(spki, 'RS256');
  console.log('good');

  try {
    const { payload } = await jose.jwtVerify(token, publicKey);

    return {
      valid: true,
      expired: false,
      decoded: payload as IJWTPayload,
    };
  } catch (error: any) {
    console.log(error);
    return {
      valid: false,
      expired: error.message === 'JWT expired',
      decoded: null,
    };
  }
}
