import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { AppError, AppNotFoundError } from './errors';
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
  logger.debug(event);
});

export function handlePrismaError(error: unknown): never | void {
  if (error instanceof PrismaClientKnownRequestError) {
    const metadata: Record<string, unknown> = {
      code: error.code,
      message: error.message,
      meta: error.meta,
    };
    if (error.code === 'P2003') {
      // Foreign key constraint failed on the field
      throw new AppNotFoundError('Not found', {
        cause: error,
        prisma: { metadata },
      });
    } else if (error.code === 'P2025') {
      // An operation failed because it depends on one or more records that were required but not found.
      throw new AppNotFoundError('Not found', {
        cause: error,
        prisma: { metadata },
      });
    }
    logger.error(error, 'known prisma error');
    throw new AppError('Could not complete service request', {
      cause: error,
      prisma: { metadata },
    });
  }
}
