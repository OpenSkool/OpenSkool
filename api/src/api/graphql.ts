import { Readable } from 'node:stream';

import { useResponseCache } from '@envelop/response-cache';
import { createServer, useErrorHandler } from '@graphql-yoga/node';
import { create } from 'cross-undici-fetch';
import type { FastifyPluginAsync } from 'fastify';
import ms from 'ms';

import schema from '~/schema';
import type { Context } from '~/schema/context';

const HTTP_STATUS_NO_CONTENT = 204;

export const graphqlRoutes: FastifyPluginAsync = async (app) => {
	const yogaServer = createServer<Context>({
		fetchAPI: create({ useNodeFetch: false }),
		logging: app.log,
		plugins: [
			useErrorHandler((errors) => {
				for (const error of errors) {
					app.log.error(error);
				}
			}),
			useResponseCache({
				includeExtensionMetadata: true,
				session({ inject: { auth, language } }: Context) {
					return `${auth.user?.id ?? 'anonymous'}-${language}`;
				},
				ttl: ms('2s'),
			}),
		],
		schema,
	});

	app.route({
		url: '/',
		method: ['GET', 'POST', 'OPTIONS'],
		handler: async (request, reply) => {
			const context: Context = {
				inject: request.diScope.cradle,
				request,
			};
			const response = await yogaServer.handleIncomingMessage(request, context);

			/* eslint-disable-next-line unicorn/no-array-for-each */
			response.headers.forEach((value, key) => {
				if (!key.startsWith('access-control-')) {
					reply.header(key, value);
				}
			});

			if (response.body == null) {
				return reply.send().status(HTTP_STATUS_NO_CONTENT);
			}

			return reply.send(Readable.from(response.body)).status(response.status);
		},
	});
};
