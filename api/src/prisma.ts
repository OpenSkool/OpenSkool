import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import {
  AppError,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
} from './errors';
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
    const extensions = {
      prisma: {
        code: error.code,
        message: error.message,
        meta: error.meta,
      },
    };
    if (error.code === 'P2003') {
      throw new AppError('Foreign key constraint failed', {
        extensions,
        statusCode: HTTP_STATUS_BAD_REQUEST,
      });
    } else if (error.code === 'P2025') {
      throw new AppError('Not found', {
        cause: error,
        extensions,
        statusCode: HTTP_STATUS_NOT_FOUND,
      });
    }
    throw new AppError('Known prisma error occured', {
      cause: error,
      extensions,
    });
  }
}
