import { FastifyPluginAsync } from 'fastify';
import plugin from 'fastify-plugin';

import { prisma } from '../prisma';

export const healthPlugin: FastifyPluginAsync = plugin(async (app) => {
  app.get('/health', async (request, reply) => {
    try {
      await prisma.user.count();
      reply.send({ database: 'ok' });
    } catch {
      reply.send({ database: 'nok' });
    }
  });
});
