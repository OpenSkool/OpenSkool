import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import mercurius from 'mercurius';

import { Context } from './context';

/**
 * https://www.prisma.io/docs/reference/api-reference/error-reference
 */

const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_NOT_FOUND = 404;

export class UserError extends mercurius.ErrorWithProps {
  constructor(
    message: string,
    extensions: object = {},
    statusCode = HTTP_STATUS_BAD_REQUEST,
  ) {
    super(message, extensions, statusCode);
  }
}

export async function handleResolverErrors<T>(
  resolver: () => Promise<T>,
  ctx: Context,
): Promise<T> {
  try {
    return await resolver();
  } catch (error) {
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
}
