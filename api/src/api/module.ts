import * as Boom from '@hapi/boom';
import { Static, Type } from '@sinclair/typebox';
import type { FastifyInstance } from 'fastify';
import cors from 'fastify-cors';
import plugin from 'fastify-plugin';

import graphqlPlugin from './graphql';
import prismaPlugin from './prisma';

const HTTP_NO_CONTENT = 204;

export default plugin(async (app: FastifyInstance) => {
  app
    .register(cors, { origin: true })
    .register(prismaPlugin)
    .register(graphqlPlugin);

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
});
