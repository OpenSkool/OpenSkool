import { FastifyPluginAsync, onRequestAsyncHookHandler } from 'fastify';
import { decodeJwt, JWTPayload } from 'jose';
import { Issuer, generators, TokenSet } from 'openid-client';
import { z } from 'zod';

import { HTTP_STATUS_BAD_REQUEST } from '../errors';

declare module 'fastify' {
  interface Session {
    openId: {
      codeVerifier?: string;
      tokenSet?: TokenSet;
    };
  }
}

export const openIdRoutes: FastifyPluginAsync = async (app) => {
  const authIssuer = await Issuer.discover(app.config.AUTH_ISSUER);

  const connectCallbackUrl = new URL(
    `${app.prefix}/connect/callback`,
    app.config.API_BASE_URL,
  ).toString();

  const client = new authIssuer.Client({
    client_id: app.config.AUTH_CLIENT_ID,
    client_secret: app.config.AUTH_CLIENT_SECRET,
    redirect_uris: [connectCallbackUrl],
    response_types: ['code'],
  });

  app.get('/connect', async (request, reply) => {
    let authUrl: string;
    if (app.config.AUTH_PKCE_ENABLED) {
      const codeVerifier = generators.codeVerifier();
      request.session.openId.codeVerifier = codeVerifier;
      authUrl = client.authorizationUrl({
        code_challenge: generators.codeChallenge(codeVerifier),
        code_challenge_method: 'S256',
        scope: 'openid email profile',
      });
    } else {
      authUrl = client.authorizationUrl({
        scope: 'openid email profile',
      });
    }
    reply.redirect(authUrl);
  });

  app.get('/connect/callback', async (request, reply) => {
    const parameters = client.callbackParams(request.raw);
    if (parameters.error != null) {
      throw new Error(
        `OAuth error: ${parameters.error} ${parameters.error_description}`,
      );
    }
    const { codeVerifier } = request.session.openId;
    request.session.openId.codeVerifier = undefined;
    try {
      const tokenSet = await client.callback(connectCallbackUrl, parameters, {
        code_verifier: codeVerifier,
      });
      request.session.openId.tokenSet = tokenSet;
      reply.redirect(app.config.APP_BASE_URL);
    } catch (error) {
      request.log.warn(error, 'openid callback could not verify token');
      reply.status(HTTP_STATUS_BAD_REQUEST);
      reply.send({ error: 'invalid callback' });
    }
  });

  app.get('/logout', async (request, reply) => {
    if (request.session.openId.tokenSet == null) {
      request.log.warn(`logout failed: no token set`);
      reply.redirect(app.config.APP_BASE_URL);
      return;
    }
    const { id_token: idToken } = request.session.openId.tokenSet;
    await request.session.destroy();
    reply.redirect(
      client.endSessionUrl({
        id_token_hint: idToken,
        post_logout_redirect_uri: `${app.config.API_BASE_URL}${app.prefix}/logout/callback`,
      }),
    );
  });

  app.get('/logout/callback', async (request, reply) => {
    reply.redirect(app.config.APP_BASE_URL);
  });
};

export const openIdRequestHook: onRequestAsyncHookHandler = async (request) => {
  request.session.openId ??= {};
  if (request.session.openId.tokenSet != null) {
    const tokenSet = new TokenSet(request.session.openId.tokenSet);
    if (tokenSet.expired()) {
      await request.session.destroy();
    }
  }
};

const zIdToken = z.object({
  name: z.string(),
  sub: z.string(),
});

export const decodeIdToken = (
  token: string,
): JWTPayload & z.infer<typeof zIdToken> => zIdToken.parse(decodeJwt(token));
