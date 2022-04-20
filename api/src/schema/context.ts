import { FastifyReply, FastifyRequest } from 'fastify';

import { DomainContext } from '../domain';

export interface Context {
  domain: DomainContext;
  request: FastifyRequest;
  reply: FastifyReply;
}
