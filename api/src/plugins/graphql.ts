import altairPlugin from 'altair-fastify-plugin';
import plugin from 'fastify-plugin';
import { GraphQLSchema } from 'graphql';
import mercurius from 'mercurius';

import { HTTP_STATUS_INTERNAL_SERVER_ERROR } from '../errors';
import schema from '../schema';
import type { Context } from '../schema/context';

const HTTP_STATUS_OK = 200;

const IS_DEV = process.env.NODE_ENV === 'development';

export default plugin(async (app) => {
  app
    .register(altairPlugin, {
      initialEnvironments: {
        base: { title: 'Local' },
      },
      initialSettings: {
        theme: 'dracula',
      },
    })
    .register(mercurius, {
      context: (request, reply): Context => {
        const { authorization } = request.headers;
        let userId: string | null = null;
        if (authorization != null) {
          const prefix = 'demo-user-id: ';
          if (authorization.toLocaleLowerCase().startsWith(prefix)) {
            userId = authorization.slice(prefix.length);
          }
        }
        return { request, reply, userId };
      },
      errorFormatter(executionResult, ctx) {
        let statusCode: number | undefined;
        for (const error of executionResult.errors ?? []) {
          const errorStatusCode =
            error.originalError instanceof mercurius.ErrorWithProps
              ? (error.originalError.statusCode as number)
              : HTTP_STATUS_INTERNAL_SERVER_ERROR;
          ctx.app.log.error({ errorStatusCode });
          const isServerError =
            errorStatusCode >= HTTP_STATUS_INTERNAL_SERVER_ERROR;
          statusCode ??= errorStatusCode;
          if (isServerError) {
            ctx.reply.log.error(error);
          }
          if (IS_DEV && isServerError) {
            error.extensions.stack = error.originalError?.stack?.split('\n');
          }
          if (!IS_DEV) {
            // @ts-expect-error works anyways
            delete error.extensions;
            error.message = 'Internal Server Error';
          }
        }
        return {
          statusCode: statusCode ?? HTTP_STATUS_OK,
          response: executionResult,
        };
      },
      schema: schema as GraphQLSchema,
    });
});
