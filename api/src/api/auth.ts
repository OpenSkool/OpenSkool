import assert from 'assert';

import { onRequestAsyncHookHandler } from 'fastify';
import plugin from 'fastify-plugin';

import { prisma } from '../prisma';
import { decodeIdToken } from './openid';

interface Auth {
  user: AuthUser | null;
}

interface AuthUser {
  id: string;
  name: string;
}

declare module 'fastify' {
  interface Session {
    auth: Auth;
  }
}

const HTTP_STATUS_NO_CONTENT = 204;

export const authRequestHook: onRequestAsyncHookHandler = async (request) => {
  request.session.auth ??= { user: null };
  const { tokenSet } = request.session.openId;
  if (tokenSet == null) {
    request.session.auth.user = null;
    return;
  }
  const idToken = tokenSet.id_token;
  assert(idToken, 'id token is not defined');
  const jwt = decodeIdToken(idToken);
  const existingUser = await prisma.user.findUnique({
    select: { id: true },
    where: { id: jwt.sub },
  });
  if (existingUser == null) {
    await prisma.user.create({
      data: { id: jwt.sub, name: jwt.name },
    });
  }
  request.session.auth.user = { id: jwt.sub, name: jwt.name };
};

export const authRoutes = plugin(async (app) => {
  app.get('/whoami', async (request, reply) => {
    if (request.session.auth.user == null) {
      reply.status(HTTP_STATUS_NO_CONTENT);
      return;
    }
    reply.send({
      name: request.session.auth.user.name,
    });
  });
});
