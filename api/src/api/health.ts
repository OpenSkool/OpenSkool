import { FastifyPluginAsync } from 'fastify';
import plugin from 'fastify-plugin';

import { prisma } from '../prisma';

export const healthPlugin: FastifyPluginAsync = plugin(async (app) => {
  const SERVER_ERROR = 500;
  const HTTP_NO_CONTENT = 204;

  app.get('/health', async (request, reply) => {
    try {
      const userCount = await prisma.user.count();
      if (userCount === 0) {
        reply.status(SERVER_ERROR);
      }
      reply.status(HTTP_NO_CONTENT);
    } catch {
      reply.status(SERVER_ERROR);
    }
  });
});
