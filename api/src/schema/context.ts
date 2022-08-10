import type { FastifyRequest } from 'fastify';

import type { AppCradle } from '~/plugins/awilix';

export interface Context {
  inject: AppCradle;
  request: FastifyRequest;
}
