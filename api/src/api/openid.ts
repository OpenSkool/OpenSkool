import { FastifyPluginAsync } from 'fastify';
import { Issuer, generators, TokenSet } from 'openid-client';

declare module 'fastify' {
  interface Session {
    codeVerifier?: string;
    tokenSet?: TokenSet;
  }
}

const HTTP_BAD_REQUEST = 400;

const openIdPlugin: FastifyPluginAsync = async (app) => {
  const authIssuer = await Issuer.discover(app.config.AUTH_ISSUER);

  const redirectUrl = new URL(
    `${app.prefix}/callback`,
    app.config.API_BASE_URL,
  ).toString();

  const client = new authIssuer.Client({
    client_id: app.config.AUTH_CLIENT_ID,
    client_secret: app.config.AUTH_CLIENT_SECRET,
    redirect_uris: [redirectUrl],
    response_types: ['code'],
  });

  app.get('/connect', async (request, reply) => {
    let authUrl: string;
    if (app.config.AUTH_PKCE_ENABLED) {
      const codeVerifier = generators.codeVerifier();
      request.session.codeVerifier = codeVerifier;
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

  app.get('/callback', async (request, reply) => {
    const parameters = client.callbackParams(request.raw);
    if (parameters.error != null) {
      throw new Error(
        `OAuth error: ${parameters.error} ${parameters.error_description}`,
      );
    }
    const { codeVerifier } = request.session;
    request.session.codeVerifier = undefined;
    try {
      const tokenSet = await client.callback(redirectUrl, parameters, {
        code_verifier: codeVerifier,
      });
      request.session.tokenSet = tokenSet;
      reply.redirect(app.config.APP_BASE_URL);
    } catch (error) {
      request.log.warn(error, 'openid callback could not verify ');
      reply.status(HTTP_BAD_REQUEST);
      reply.send({ error: 'invalid callback' });
    }
  });

  app.get('/status', async (request, reply) => {
    const idToken = request.session.tokenSet?.id_token;
    reply.send({ isLoggedIn: idToken != null });
  });
};

export default openIdPlugin;
