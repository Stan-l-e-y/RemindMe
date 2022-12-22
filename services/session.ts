import { userAgent } from 'next/server';
import prisma from '../lib/prisma';

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
