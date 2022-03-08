import altairPlugin from 'altair-fastify-plugin';
import plugin from 'fastify-plugin';
import { GraphQLSchema } from 'graphql';
import mercurius from 'mercurius';

import { Context } from '../schema/context';
import schema from '../schema/module';

export default plugin(async (app) => {
  app
    .register(altairPlugin, {
      initialEnvironments: {
        base: { title: 'Local' },
      },
    })
    .register(mercurius, {
      context: (request, reply): Context => {
        return { request, reply };
      },
      schema: schema as unknown as GraphQLSchema,
    });
});
