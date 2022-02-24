import { Static, Type } from '@sinclair/typebox';
import env from 'fastify-env';
import plugin from 'fastify-plugin';

const schema = Type.Object({
  NODE_ENV: Type.Union(
    [Type.Literal('development'), Type.Literal('production')],
    { default: 'development' },
  ),
  PORT: Type.String({ default: '3030' }),
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
