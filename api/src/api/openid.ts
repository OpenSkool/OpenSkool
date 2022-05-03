import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import plugin from 'fastify-plugin';
import {
  createRemoteJWKSet,
  decodeJwt,
  errors,
  JWTPayload,
  jwtVerify,
} from 'jose';
import { Issuer, generators, TokenSet } from 'openid-client';
import { z } from 'zod';

import { HTTP_STATUS_BAD_REQUEST } from '../errors';

declare module 'fastify' {
  interface Session {
    openId: {
      codeVerifier?: string;
      state?: { from?: string };
      tokenSet?: TokenSet;
    };
  }
}

export const openIdPlugin: FastifyPluginAsync<{ prefix: string }> = plugin(
  async (app, options) => {
    const localPath = (relativePath: string): string =>
      `${options.prefix}${relativePath}`;

    const globalPath = (relativePath: string): string =>
      `${app.prefix}${localPath(relativePath)}`;

    const absoluteUrl = (relativePath: string): string => {
      const url = new URL(app.config.API_BASE_URL);
      url.pathname = globalPath(relativePath);
      return url.toString();
    };

    const authIssuer = await Issuer.discover(app.config.AUTH_ISSUER);

    const openIdClient = new authIssuer.Client({
      client_id: app.config.AUTH_CLIENT_ID,
      client_secret: app.config.AUTH_CLIENT_SECRET,
      response_types: ['code'],
    });

    app.addHook('onRequest', async (request) => {
      request.session.openId ??= {};
      if (request.session.openId.tokenSet == null) {
        return;
      }
      const tokenSet = new TokenSet(request.session.openId.tokenSet);
      if (tokenSet.expired()) {
        request.session.openId.tokenSet = undefined;
        try {
          const freshTokenSet = await openIdClient.refresh(tokenSet);
          if (freshTokenSet.access_token != null) {
            const JWKS = createRemoteJWKSet(
              new URL(
                `${request.server.config.AUTH_ISSUER}/protocol/openid-connect/certs`,
              ),
            );
            await jwtVerify(freshTokenSet.access_token, JWKS);
            request.session.openId.tokenSet = freshTokenSet;
          }
        } catch (error) {
          if (
            (!(error instanceof Error) ||
              !error.message.startsWith('invalid_grant')) &&
            !(error instanceof errors.JOSEError)
          ) {
            request.log.warn(error);
          }
        }
      }
    });

    const connectQuerystringSchema = Type.Object({
      from: Type.Optional(Type.String()),
    });

    app.get<{
      Querystring: Static<typeof connectQuerystringSchema>;
    }>(localPath('/connect'), {
      async handler(request, reply) {
        const codeVerifier = generators.codeVerifier();
        request.session.openId.codeVerifier = codeVerifier;
        request.session.openId.state = request.query;
        const authUrl = openIdClient.authorizationUrl({
          code_challenge: generators.codeChallenge(codeVerifier),
          code_challenge_method: 'S256',
          redirect_uri: absoluteUrl('/connect/callback'),
          scope: 'openid email profile',
        });
        reply.redirect(authUrl);
      },
      schema: { querystring: connectQuerystringSchema },
    });

    app.get(localPath('/connect/callback'), async (request, reply) => {
      const parameters = openIdClient.callbackParams(request.raw);
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
        const tokenSet = await openIdClient.callback(
          absoluteUrl('/connect/callback'),
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
    }>(localPath('/logout'), {
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
          openIdClient.endSessionUrl({
            id_token_hint: idToken,
            post_logout_redirect_uri: absoluteUrl('/logout/callback'),
          }),
        );
      },
      schema: { querystring: logoutQuerystringSchema },
    });

    app.get(localPath('/logout/callback'), async (request, reply) => {
      const appUrl = new URL(app.config.APP_BASE_URL);
      const { state } = request.session.openId;
      request.session.openId.state = undefined;
      appUrl.pathname = state?.from ?? '/';
      reply.redirect(appUrl.toString());
    });
  },
);

const zIdToken = z.object({
  name: z.string(),
  sub: z.string(),
});

export const decodeIdToken = (
  token: string,
): JWTPayload & z.infer<typeof zIdToken> => zIdToken.parse(decodeJwt(token));
