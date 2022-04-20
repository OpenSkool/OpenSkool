import { Readable } from 'stream';

import { useResponseCache } from '@envelop/response-cache';
import { createServer } from '@graphql-yoga/node';
import acceptLanguageParser from 'accept-language-parser';
import { FastifyPluginAsync } from 'fastify';
import ms from 'ms';

import schema from '../schema';
import type { Context } from '../schema/context';

const HTTP_STATUS_NO_CONTENT = 204;

interface IterableHeaders extends Headers {
  // [Symbol.iterator]: () => IterableIterator<[string, string]>;
  entries: () => IterableIterator<[string, string]>;
  // keys: () => IterableIterator<string>;
  // values: () => IterableIterator<string>;
}

export const graphqlRoutes: FastifyPluginAsync = async (app) => {
  const yogaServer = createServer<Context>({
    logging: app.log,
    schema,
    plugins: [
      useResponseCache({
        includeExtensionMetadata: true,
        session: (context: Context) => {
          const {
            domain,
            request: { session },
          } = context;
          return `${session.auth.user?.id ?? 'anonymous'}-${domain.locale}`;
        },
        ttl: ms('2s'),
      }),
    ],
  });

  app.route({
    url: '/',
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (request, reply) => {
      const { 'accept-language': acceptLanguage = '' } = request.headers;

      const locale =
        acceptLanguageParser.pick(['en', 'nl'], acceptLanguage) ?? 'en';

      const context: Context = {
        domain: {
          locale,
          userId: request.session.auth.user?.id ?? null,
        },
        request,
        reply,
      };
      const response = await yogaServer.handleIncomingMessage(request, context);

      for (const [key, value] of (
        response.headers as IterableHeaders
      ).entries()) {
        reply.header(key, value);
      }

      if (response.body == null) {
        reply.status(HTTP_STATUS_NO_CONTENT);
        reply.send();
      } else {
        reply.status(response.status);
        reply.send(Readable.from(response.body));
      }
    },
  });
};
