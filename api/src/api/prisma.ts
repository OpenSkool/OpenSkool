import { PrismaClient } from '@prisma/client';
import plugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export const prisma = new PrismaClient();

export default plugin(async (app) => {
  await prisma.$connect();

  app
    .addHook('onClose', (server) => server.prisma.$disconnect())
    .decorate('prisma', prisma);
});
