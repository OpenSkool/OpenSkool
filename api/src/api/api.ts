import cookiePlugin from '@fastify/cookie';
import corsPlugin from '@fastify/cors';
import sessionPlugin from '@fastify/session';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import * as Boom from '@hapi/boom';
import { Type } from '@sinclair/typebox';
import connectRedis, { type Client } from 'connect-redis';
import type { FastifyPluginAsync } from 'fastify';
import Redis from 'ioredis';
import ms from 'ms';

import { domainPlugin } from '~/domain';
import { prismaPlugin } from '~/plugins/prisma';

import { authPlugin } from './auth/plugin';
import { graphqlRoutes } from './graphql';
import { healthPlugin } from './health';
import { injectPlugin } from './inject';
import { keycloakPlugin } from './keycloak';
import { openIdPlugin } from './openid';

const HTTP_NO_CONTENT = 204;

const apiPlugin: FastifyPluginAsync = async (app) => {
	app
		.register(corsPlugin, { credentials: true, origin: true })
		.register(prismaPlugin)
		.register(cookiePlugin)
		.register(sessionPlugin, {
			cookieName: 'osid',
			cookie: {
				domain: app.config.SESSION_DOMAIN,
				maxAge: ms('24h'),
				path: '/',
				sameSite: 'lax',
				secure: !app.config.SESSION_ALLOW_INSECURE,
			},
			secret: app.config.SESSION_SECRET,
			store: ((): sessionPlugin.SessionStore | undefined => {
				// `connect-redis` is compatible with `@fastify/session`, but the types are not.
				/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
				const RedisStore = connectRedis(sessionPlugin as any);
				const redisClient = new Redis(app.config.SESSION_STORE ?? '');
				app.addHook('onClose', () => redisClient.quit());
				const store = new RedisStore({
					client: redisClient as unknown as Client,
				});
				return store as unknown as sessionPlugin.SessionStore;
			})(),
		})
		.register(healthPlugin)
		.register(openIdPlugin, { prefix: '/openid' })
		.register(authPlugin) // After openId
		.register(keycloakPlugin) // After openId
		.register(injectPlugin)
		.register(domainPlugin)
		.register(graphqlRoutes, { prefix: '/graphql' });

	app.get('/', async (request, reply) => {
		reply.status(HTTP_NO_CONTENT);
	});

	app.withTypeProvider<TypeBoxTypeProvider>().post('/echo', {
		async handler(request, reply) {
			return reply.send({ message: request.body.message });
		},
		schema: {
			body: Type.Object({ message: Type.String() }),
		},
	});

	app.get('/bad-request', () => {
		throw Boom.badRequest('this is a bad request');
	});

	app.get('/internal-server-error', () => {
		throw new Error('big problem');
	});
};

export default apiPlugin;
