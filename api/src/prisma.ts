import { PrismaClient } from '@prisma/client';
/* https://github.com/prisma/prisma/issues/10775 */
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/index.js';

import { AppError, AppNotFoundError } from '~/errors';
import logger from '~/logger';

export const prisma = new PrismaClient({
	log: [
		{ emit: 'event', level: 'error' },
		{ emit: 'event', level: 'info' },
		{ emit: 'event', level: 'warn' },
		{ emit: 'event', level: 'query' },
	],
});

prisma.$on('error', ({ message, timestamp }) => {
	logger.error({ msg: message, time: timestamp });
});
prisma.$on('info', ({ message, timestamp }) => {
	logger.info({ msg: message, time: timestamp });
});
prisma.$on('warn', ({ message, timestamp }) => {
	logger.warn({ msg: message, time: timestamp });
});
prisma.$on('query', ({ timestamp: time, ...metadata }) => {
	logger.debug({ ...metadata, time });
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
