import { FastifyPluginAsync } from 'fastify';
import plugin from 'fastify-plugin';

import { prisma } from '~/prisma';

export const healthPlugin: FastifyPluginAsync = plugin(async (app) => {
  app.get('/health', async (request, reply) => {
    try {
      await prisma.user.count();
      return reply.send({ database: 'ok' });
    } catch {
      return reply.send({ database: 'nok' });
    }
  });
});
