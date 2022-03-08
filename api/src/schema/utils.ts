import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { HTTP_STATUS_NOT_FOUND, UserError } from '../errors';
import type { Context } from './context';

/**
 * https://www.prisma.io/docs/reference/api-reference/error-reference
 */

export function handleResolverError(error: unknown, ctx: Context): never {
  if (error instanceof PrismaClientKnownRequestError) {
    const extensions =
      process.env.NODE_ENV === 'development'
        ? {
            prisma: {
              code: error.code,
              message: error.message,
              meta: error.meta,
            },
          }
        : undefined;
    if (error.code === 'P2003') {
      throw new UserError('Foreign key constraint failed', extensions);
    } else if (error.code === 'P2025') {
      throw new UserError('Not found', extensions, HTTP_STATUS_NOT_FOUND);
    }
    ctx.request.log.error(error);
    throw new UserError('Known prisma error occured', extensions);
  }
  ctx.request.log.error(error);
  throw new Error('Internal Server Error');
}
