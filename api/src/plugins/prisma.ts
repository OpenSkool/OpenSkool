import plugin from 'fastify-plugin';

import { prisma } from '../prisma';

export default plugin(async (app) => {
  await prisma.$connect();

  app.addHook('onClose', () => prisma.$disconnect());
});
