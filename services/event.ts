import prisma from '@/lib/prisma';
import { EventInput } from '@/types/event.schema';

export async function createEvent(input: EventInput, userId: number) {
  try {
    const event = await prisma.event.create({
      data: {
        ...input.body,
        userId: userId,
      },
    });

    return event;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findEvents(query: object) {
  try {
    const events = await prisma.event.findMany({
      where: query,
    });
    return events;
  } catch (error: any) {
    throw new Error(error);
  }
}
