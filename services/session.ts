import prisma from '../lib/prisma';
import { verifyJwt, signJwt } from '../lib/jwt.utils';
import { get } from 'lodash';

export async function createSession(userId: number, userAgent: string) {
  try {
    const session = await prisma.session.create({
      data: {
        userId,
        userAgent,
      },
    });
    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findSessions(query: object) {
  try {
    const sessions = await prisma.session.findMany({
      where: query,
    });
    return sessions;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateSession(query: object, data: object) {
  try {
    const session = await prisma.session.update({
      where: query,
      data,
    });
    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  try {
    const { decoded } = await verifyJwt(refreshToken, 'REFRESH_PUBLIC_KEY');

    if (!decoded || !get(decoded, 'session')) return false;

    const session = await prisma.session.findUnique({
      where: { id: Number(get(decoded, 'session')) },
    });

    if (!session || !session.valid) return false;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) return false;

    const accessTokenTtl = (process.env['accessTokenTtl'] as string) ?? '15m';

    const accessToken = await signJwt(
      { ...user, session: session.id },
      'ACCESS_TOKEN_PRIVATE_KEY',
      undefined,
      accessTokenTtl
    );
    return accessToken;
  } catch (error: any) {
    throw new Error(error);
  }
}
//TODO:REMOVE, this is a temp function just so i can test the index page (react or next or whatever doesnt like rendering scaler values ie createdAt)
export function exclude<Session, Key extends keyof Session>(
  session: Session,
  keys: Key[]
): Omit<Session, Key> {
  for (let key of keys) {
    delete session[key];
  }
  return session;
}
