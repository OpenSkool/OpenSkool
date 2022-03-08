import { PrismaClient } from '@prisma/client';

import logger from './logger';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'query' },
  ],
});

prisma.$on('error', (event) => {
  logger.error(event);
});
prisma.$on('info', (event) => {
  logger.info(event);
});
prisma.$on('warn', (event) => {
  logger.warn(event);
});
prisma.$on('query', (event) => {
  logger.info(event);
});
