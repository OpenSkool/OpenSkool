import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginAsync, onRequestAsyncHookHandler } from 'fastify';
import plugin from 'fastify-plugin';
import { decodeJwt, JWTPayload } from 'jose';
import { Client, Issuer, generators, TokenSet } from 'openid-client';
import { z } from 'zod';

import { HTTP_STATUS_BAD_REQUEST } from '../errors';

declare module 'fastify' {
  interface FastifyInstance {
    openId: {
      client: Client;
    };
  }

  interface Session {
    openId: {
      codeVerifier?: string;
      state?: { from?: string };
      tokenSet?: TokenSet;
    };
  }
}

export const openIdPlugin = plugin(async (app) => {
  const authIssuer = await Issuer.discover(app.config.AUTH_ISSUER);

  const client = new authIssuer.Client({
    client_id: app.config.AUTH_CLIENT_ID,
    client_secret: app.config.AUTH_CLIENT_SECRET,
    response_types: ['code'],
  });

  app.decorate('openId', { client });
});

export const openIdRoutes: FastifyPluginAsync = async (app) => {
  const connectCallbackUrl = new URL(
    `${app.prefix}/connect/callback`,
    app.config.API_BASE_URL,
  ).toString();

  const connectQuerystringSchema = Type.Object({
    from: Type.Optional(Type.String()),
  });

  app.get<{
    Querystring: Static<typeof connectQuerystringSchema>;
  }>('/connect', {
    async handler(request, reply) {
      const codeVerifier = generators.codeVerifier();
      request.session.openId.codeVerifier = codeVerifier;
      request.session.openId.state = request.query;
      const authUrl = app.openId.client.authorizationUrl({
        code_challenge: generators.codeChallenge(codeVerifier),
        code_challenge_method: 'S256',
        redirect_uri: connectCallbackUrl,
        scope: 'openid email profile',
      });
      reply.redirect(authUrl);
    },
    schema: { querystring: connectQuerystringSchema },
  });

  app.get('/connect/callback', async (request, reply) => {
    const parameters = app.openId.client.callbackParams(request.raw);
    if (parameters.error != null) {
      request.log.warn(
        `oauth callback error: ${parameters.error} ${parameters.error_description}`,
      );
      reply.redirect(app.config.APP_BASE_URL);
      return;
    }
    const { codeVerifier, state } = request.session.openId;
    request.session.openId.codeVerifier = undefined;
    request.session.openId.state = undefined;
    try {
      const tokenSet = await app.openId.client.callback(
        connectCallbackUrl,
        parameters,
        { code_verifier: codeVerifier },
      );
      request.session.openId.tokenSet = tokenSet;
      const appUrl = new URL(app.config.APP_BASE_URL);
      appUrl.pathname = state?.from ?? '/';
      reply.redirect(appUrl.toString());
    } catch (error) {
      request.log.warn(error, 'openid callback could not verify token');
      reply.status(HTTP_STATUS_BAD_REQUEST);
      reply.send({ error: 'invalid callback' });
    }
  });

  const logoutQuerystringSchema = Type.Object({
    from: Type.Optional(Type.String()),
  });

  app.get<{
    Querystring: Static<typeof logoutQuerystringSchema>;
  }>('/logout', {
    async handler(request, reply) {
      if (request.session.openId.tokenSet == null) {
        request.log.warn(`logout failed: no token set`);
        reply.redirect(app.config.APP_BASE_URL);
        return;
      }
      request.session.openId.state = request.query;
      const { id_token: idToken } = request.session.openId.tokenSet;
      request.session.openId.tokenSet = undefined;
      reply.redirect(
        app.openId.client.endSessionUrl({
          id_token_hint: idToken,
          post_logout_redirect_uri: `${app.config.API_BASE_URL}${app.prefix}/logout/callback`,
        }),
      );
    },
    schema: { querystring: logoutQuerystringSchema },
  });

  app.get('/logout/callback', async (request, reply) => {
    const appUrl = new URL(app.config.APP_BASE_URL);
    const { state } = request.session.openId;
    request.session.openId.state = undefined;
    appUrl.pathname = state?.from ?? '/';
    reply.redirect(appUrl.toString());
  });
};

export const openIdRequestHook: onRequestAsyncHookHandler = async (request) => {
  request.session.openId ??= {};
};

const zIdToken = z.object({
  name: z.string(),
  sub: z.string(),
});

export const decodeIdToken = (
  token: string,
): JWTPayload & z.infer<typeof zIdToken> => zIdToken.parse(decodeJwt(token));
