import { FastifyReply, FastifyRequest } from 'fastify';

export interface Context {
  locale: string;
  request: FastifyRequest;
  reply: FastifyReply;
  userId: string | null;
}
