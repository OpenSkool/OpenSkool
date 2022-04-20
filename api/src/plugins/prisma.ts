import plugin from 'fastify-plugin';

import { prisma } from '../prisma';

export const prismaPlugin = plugin(async (app) => {
  await prisma.$connect();

  app.addHook('onClose', () => prisma.$disconnect());
});
