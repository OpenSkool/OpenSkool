import { callbackify } from 'node:util';

import cookiePlugin from '@fastify/cookie';
import corsPlugin from '@fastify/cors';
import sessionPlugin from '@fastify/session';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import * as Boom from '@hapi/boom';
import { Type } from '@sinclair/typebox';
import type { FastifyPluginAsync } from 'fastify';
import ms from 'ms';

import { prismaPlugin } from '~/plugins/prisma';

import { authPlugin } from './auth';
import { graphqlRoutes } from './graphql';
import { healthPlugin } from './health';
import { openIdPlugin } from './openid';
import * as sessionStore from './session-store';

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
      store: {
        destroy: callbackify(sessionStore.destroy),
        get: callbackify(sessionStore.get),
        set: callbackify(sessionStore.set),
      },
    })
    .register(healthPlugin)
    .register(openIdPlugin, { prefix: '/openid' })
    .register(authPlugin)
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
