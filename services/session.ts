import { userAgent } from 'next/server';
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
      { expiresIn: accessTokenTtl } // 15 minutes
    );

    return accessToken;
  } catch (error: any) {
    throw new Error(error);
  }
}
