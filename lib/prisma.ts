import { Prisma, PrismaClient } from '@prisma/client/edge';
//TODO: possibly make another client for Nodejs, since
//this one always hits the proxy
let prisma: PrismaClient<Prisma.PrismaClientOptions, 'info' | 'warn' | 'error'>;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  });
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient<Prisma.PrismaClientOptions, 'info' | 'warn' | 'error'>;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
