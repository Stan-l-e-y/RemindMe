import { User } from '@prisma/client';
import * as jose from 'jose';

export interface IJWTPayload extends jose.JWTPayload {
  user: User;
  session: number;
}

export async function signJwt(
  payload: jose.JWTPayload,
  keyName: 'ACCESS_TOKEN_PRIVATE_KEY' | 'REFRESH_PRIVATE_KEY',
  options?: jose.JWTPayload,
  ttl?: string
) {
  const alg = process.env['alg'] as string;

  let pkcs8 = atob(process.env.ACCESS_TOKEN_PRIVATE_KEY as string);
  if (keyName === 'REFRESH_PRIVATE_KEY') {
    pkcs8 = atob(process.env.REFRESH_PRIVATE_KEY as string);
  }

  const privateKey = await jose.importPKCS8(pkcs8, 'RS256');

  return await new jose.SignJWT({ ...payload, ...(options && options) })
    .setProtectedHeader({ alg })
    .setExpirationTime(ttl || '15m')
    .sign(privateKey);
}

export async function verifyJwt(
  token: string,
  keyName: 'ACCESS_TOKEN_PUBLIC_KEY' | 'REFRESH_PUBLIC_KEY'
) {
  //i think this shit finally works... depreciated but its the only way??
  //it decodes a base64 encoded string to a string using utf-8 encoding
  let spki = atob(process.env.ACCESS_TOKEN_PUBLIC_KEY as string);
  if (keyName === 'REFRESH_PUBLIC_KEY') {
    spki = atob(process.env.REFRESH_PUBLIC_KEY as string);
  }

  const publicKey = await jose.importSPKI(spki, 'RS256');

  try {
    const { payload } = await jose.jwtVerify(token, publicKey);

    return {
      valid: true,
      expired: false,
      decoded: payload as IJWTPayload,
    };
  } catch (error: any) {
    console.log(error);
    if (error instanceof jose.errors.JWTExpired) {
      return {
        valid: false,
        expired: true,
        decoded: null,
      };
    }
    return {
      valid: false,
      expired: error.code === 'ERR_JWT_EXPIRED',
      decoded: null,
    };
  }
}
