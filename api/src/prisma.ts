import { PrismaClient } from '@prisma/client';
import plugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default plugin(async (app) => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  app
    .addHook('onClose', (server) => server.prisma.$disconnect())
    .decorate('prisma', prisma);
});
