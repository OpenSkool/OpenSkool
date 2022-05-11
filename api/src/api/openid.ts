import { Static, Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import plugin from 'fastify-plugin';
import {
  createRemoteJWKSet,
  decodeJwt,
  errors as joseErrors,
  JWTPayload,
  jwtVerify,
} from 'jose';
import { Issuer, generators, TokenSet } from 'openid-client';
import { z } from 'zod';

const { JOSEError: JoseError } = joseErrors;

declare module 'fastify' {
  interface Session {
    openId: {
      codeVerifier?: string;
      state?: { from?: string };
      tokenSet?: AppTokenSet;
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
      return new URL(
        globalPath(relativePath),
        app.config.API_BASE_URL,
      ).toString();
    };

    const authIssuer = await Issuer.discover(app.config.AUTH_ISSUER);

    const openIdClient = new authIssuer.Client({
      client_id: app.config.AUTH_CLIENT_ID,
      client_secret: app.config.AUTH_CLIENT_SECRET,
      response_types: ['code'],
    });

    const JWKS = createRemoteJWKSet(
      new URL('./protocol/openid-connect/certs', app.config.AUTH_ISSUER),
    );

    app.addHook('onRequest', async (request) => {
      request.session.openId ??= {};
      if (request.session.openId.tokenSet == null) {
        return;
      }
      const tokenSet = parseTokenSet(request.session.openId.tokenSet);
      if (tokenSet.expired()) {
        request.log.debug('tokenSet expired');
        request.session.openId.tokenSet = undefined;
        try {
          const freshTokenSet = parseTokenSet(
            await openIdClient.refresh(tokenSet),
          );
          request.log.debug('tokenSet refreshed');
          await jwtVerify(freshTokenSet.access_token, JWKS);
          request.log.debug('tokenSet validated');
          request.session.openId.tokenSet = freshTokenSet;
        } catch (error) {
          if (
            error instanceof Error &&
            error.message.startsWith('invalid_grant')
          ) {
            request.log.warn(error);
          } else if (error instanceof JoseError) {
            request.log.warn(error, 'could not verify accessToken');
          } else {
            request.log.error(error, 'could not refresh tokenSet');
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
      const redirectUrl = new URL(state?.from ?? '/', app.config.APP_BASE_URL);
      try {
        const newTokenSet = parseTokenSet(
          await openIdClient.callback(
            absoluteUrl('/connect/callback'),
            parameters,
            { code_verifier: codeVerifier },
          ),
        );
        await jwtVerify(newTokenSet.access_token, JWKS);
        request.log.debug('tokenSet validated');
        request.session.openId.tokenSet = newTokenSet;
        reply.redirect(redirectUrl.toString());
      } catch (error) {
        if (error instanceof JoseError) {
          request.log.warn(error, 'could not verify accessToken');
          redirectUrl.searchParams.set('error', 'jwt_error');
        } else {
          request.log.error(error, 'could not initialize tokenSet');
          redirectUrl.searchParams.set('error', 'unknown');
        }
        reply.redirect(redirectUrl.toString());
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
      const { state } = request.session.openId;
      request.session.openId.state = undefined;
      reply.redirect(
        new URL(state?.from ?? '/', app.config.APP_BASE_URL).toString(),
      );
    });
  },
);

const zIdToken = z.object({
  name: z.string(),
  sub: z.string(),
});

type AppIdToken = JWTPayload & z.infer<typeof zIdToken>;

export function decodeIdToken(token: string): AppIdToken {
  return zIdToken.parse(decodeJwt(token));
}

const zCodeFlowTokenSet = z.object({
  access_token: z.string(),
  token_type: z.string(),
  id_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  expires_at: z.number(),
  session_state: z.string(),
  scope: z.string(),
});

type AppTokenSet = TokenSet & z.infer<typeof zCodeFlowTokenSet>;

function parseTokenSet(tokenSet: TokenSet): AppTokenSet {
  return new TokenSet(zCodeFlowTokenSet.parse(tokenSet)) as AppTokenSet;
}
