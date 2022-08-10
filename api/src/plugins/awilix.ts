import { Cradle, fastifyAwilixPlugin, RequestCradle } from '@fastify/awilix';
import plugin from 'fastify-plugin';

export type AppCradle = Cradle & RequestCradle;

export default plugin(async (app) => {
  app.register(fastifyAwilixPlugin);
});
