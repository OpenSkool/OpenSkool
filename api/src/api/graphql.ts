import { Readable } from 'stream';

import { useResponseCache } from '@envelop/response-cache';
import { createServer } from '@graphql-yoga/node';
import acceptLanguageParser from 'accept-language-parser';
import { create } from 'cross-undici-fetch';
import { FastifyPluginAsync } from 'fastify';
import ms from 'ms';

import schema from '../schema';
import type { Context } from '../schema/context';

const HTTP_STATUS_NO_CONTENT = 204;

export const graphqlRoutes: FastifyPluginAsync = async (app) => {
  const yogaServer = createServer<Context>({
    fetchAPI: create({ useNodeFetch: false }),
    logging: app.log,
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
    schema,
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

      /* eslint-disable-next-line unicorn/no-array-for-each */
      response.headers.forEach((value, key) => {
        if (!key.startsWith('access-control-')) {
          reply.header(key, value);
        }
      });

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
