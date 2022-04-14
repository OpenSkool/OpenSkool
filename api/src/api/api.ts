import sessionPlugin from '@fastify/session';
import * as Boom from '@hapi/boom';
import { Static, Type } from '@sinclair/typebox';
import type { FastifyPluginAsync } from 'fastify';
import cookiePlugin from 'fastify-cookie';
import corsPlugin from 'fastify-cors';
import ms from 'ms';

import prismaPlugin from '../plugins/prisma';
import graphqlPlugin from './graphql';
import openIdPlugin from './openid';

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
        maxAge: ms('1h'),
        path: '/',
        sameSite: 'lax',
        secure: !app.config.SESSION_ALLOW_INSECURE,
      },
      secret: app.config.SESSION_SECRET,
    })
    .register(graphqlPlugin, { prefix: '/graphql' })
    .register(openIdPlugin, { prefix: '/openid' });

  app.get('/', async (request, reply) => {
    reply.status(HTTP_NO_CONTENT);
  });

  const echoSchema = Type.Object({
    message: Type.String(),
  });
  app.post<{ Body: Static<typeof echoSchema> }>(
    '/echo',
    { schema: { body: echoSchema } },
    async (request, reply) => {
      reply.send({ message: request.body.message });
    },
  );

  app.get('/bad-request', () => {
    throw Boom.badRequest('this is a bad request');
  });

  app.get('/internal-server-error', () => {
    throw new Error('big problem');
  });
};

export default apiPlugin;
