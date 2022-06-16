import { fetch } from 'cross-undici-fetch';
import { FastifyPluginAsync } from 'fastify';
import plugin from 'fastify-plugin';

import { prisma } from '~/prisma';

const HTTP_OK = 200;

export const healthPlugin: FastifyPluginAsync = plugin(async (app) => {
  app.get('/health', async (request, reply) => {
    const authApiResponse = await fetch(app.config.AUTH_ISSUER, {
      method: 'HEAD',
    });
    const prismaMetrics = await prisma.$metrics.json();
    return reply.send({
      auth: {
        isUp: authApiResponse.status === HTTP_OK,
      },
      prisma: prismaMetrics,
    });
  });
});
