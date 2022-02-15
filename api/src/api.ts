import * as Boom from '@hapi/boom';
import { Static, Type } from '@sinclair/typebox';
import type { FastifyInstance } from 'fastify';

const HTTP_NO_CONTENT = 204;

export default async (app: FastifyInstance): Promise<void> => {
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
