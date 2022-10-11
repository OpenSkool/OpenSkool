import { fetch } from 'cross-undici-fetch';
import type { FastifyPluginAsync } from 'fastify';
import plugin from 'fastify-plugin';

import { prisma } from '~/prisma';

const HTTP_OK = 200;
const HTTP_UNAVAILABLE = 503;

export const healthPlugin: FastifyPluginAsync = plugin(async (app) => {
	async function checkAuth(): Promise<boolean> {
		try {
			const response = await fetch(
				new URL('/health/ready', app.config.AUTH_BASE_URL).toString(),
			);
			return response.status === HTTP_OK;
		} catch {
			return false;
		}
	}

	async function checkDatabase(): Promise<boolean> {
		try {
			await prisma.$queryRaw`SELECT 1`;
			return true;
		} catch {
			return false;
		}
	}

	app.get('/health/live', async (_, reply) => {
		return reply.send({ live: true });
	});

	app.get('/health/ready', async (_, reply) => {
		const auth = await checkAuth();
		const database = await checkDatabase();
		reply.code(auth && database ? HTTP_OK : HTTP_UNAVAILABLE);
		return reply.send({ auth, database });
	});
});
