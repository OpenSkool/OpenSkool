import { PrismaClient } from '@prisma/client';
import plugin from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default plugin(async (app) => {
  const prisma = new PrismaClient({
    log: [
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
      { emit: 'event', level: 'query' },
    ],
  });

  prisma.$on('error', (event) => {
    app.log.error(event);
  });
  prisma.$on('info', (event) => {
    app.log.info(event);
  });
  prisma.$on('warn', (event) => {
    app.log.warn(event);
  });
  prisma.$on('query', (event) => {
    app.log.info(event);
  });

  await prisma.$connect();

  app
    .addHook('onClose', (server) => server.prisma.$disconnect())
    .decorate('prisma', prisma);
});
