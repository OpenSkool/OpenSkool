import env from '@fastify/env';
import { Type, type Static } from '@sinclair/typebox';
import plugin from 'fastify-plugin';

const schema = Type.Object({
	APP_BASE_URL: Type.String(),
	API_BASE_URL: Type.String(),
	AUTH_BASE_URL: Type.String(),
	AUTH_CLIENT_ID: Type.String(),
	AUTH_CLIENT_SECRET: Type.String(),
	AUTH_REALM_NAME: Type.String(),
	DATABASE_URL: Type.String(),
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
	SESSION_STORE: Type.Optional(Type.String()),
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
