import altairPlugin from 'altair-fastify-plugin';
import plugin from 'fastify-plugin';
import { GraphQLSchema } from 'graphql';
import mercurius from 'mercurius';

import { Context } from './context';
import schema from './schema';

export default plugin(async (app) => {
  app
    .register(altairPlugin, {
      initialEnvironments: {
        base: { title: 'Local' },
      },
    })
    .register(mercurius, {
      context: (request, reply): Context => {
        return { prisma: app.prisma, request, reply };
      },
      schema: schema as unknown as GraphQLSchema,
    });
});