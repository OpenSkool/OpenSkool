import { Readable } from 'stream';

import { useResponseCache } from '@envelop/response-cache';
import { createServer } from '@graphql-yoga/node';
import acceptLanguageParser from 'accept-language-parser';
import altairPlugin from 'altair-fastify-plugin';
import plugin from 'fastify-plugin';
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

export default plugin(async (app) => {
  app.register(altairPlugin, {
    initialEnvironments: {
      base: { title: 'Local' },
    },
    initialSettings: {
      theme: 'dracula',
    },
  });

  const yogaServer = createServer<Context>({
    logging: app.log,
    schema,
    plugins: [
      useResponseCache({
        includeExtensionMetadata: true,
        session: (context: Context) =>
          `${context.userId ?? 'anonymous'}-${context.locale}`,
        ttl: ms('2s'),
      }),
    ],
  });

  app.route({
    url: '/graphql',
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (request, reply) => {
      const { authorization, 'accept-language': acceptLanguage = '' } =
        request.headers;

      const locale =
        acceptLanguageParser.pick(['en', 'nl'], acceptLanguage) ?? 'en';

      let userId: string | null = null;
      if (authorization != null) {
        const prefix = 'demo-user-id: ';
        if (authorization.toLocaleLowerCase().startsWith(prefix)) {
          userId = authorization.slice(prefix.length);
        }
      }
      const context: Context = {
        userId,
        request,
        reply,
        locale,
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
});
