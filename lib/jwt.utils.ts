import * as jose from 'jose';

export async function signJwt(
  payload: jose.JWTPayload,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jose.JWTPayload
) {
  const signingKey = process.env[keyName] as string;

  const alg = process.env['alg'] as string;

  const privateKey = await jose.importPKCS8(signingKey, alg);

  return await new jose.SignJWT({ ...payload, ...(options && options) })
    .setProtectedHeader({ alg })
    .sign(privateKey);
}

export async function verifyJwt(
  token: string,
  keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
) {
  const publicKey = process.env[keyName] as string;

  const alg = process.env['alg'] as string;

  const key = await jose.importSPKI(publicKey, alg);

  try {
    const { payload } = await jose.jwtVerify(token, key);

    return {
      valid: true,
      expired: false,
      decoded: payload,
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
