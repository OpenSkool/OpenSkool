import { Static, Type } from '@sinclair/typebox';
import env from 'fastify-env';
import plugin from 'fastify-plugin';

const schema = Type.Object({
  APP_BASE_URL: Type.String(),

  AUTH_CLIENT_ID: Type.String(),
  AUTH_CLIENT_SECRET: Type.String(),
  AUTH_ISSUER: Type.String(),

  API_BASE_URL: Type.String(),
  HOST: Type.String(),
  NODE_ENV: Type.Union(
    [
      Type.Literal('development'),
      Type.Literal('production'),
      Type.Literal('test'),
    ],
    { default: 'production' },
  ),
  PORT: Type.Number(),

  SESSION_ALLOW_INSECURE: Type.Boolean({ default: false }),
  SESSION_DOMAIN: Type.String(),
  SESSION_SECRET: Type.String({ minLength: 32 }),
});

type Config = Static<typeof schema>;

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
  }
}

export default plugin(async (app) => {
  app.register(env, { schema: Type.Strict(schema) });
});
