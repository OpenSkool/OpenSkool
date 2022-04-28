import assert from 'assert';

import { onRequestAsyncHookHandler } from 'fastify';
import plugin from 'fastify-plugin';
import { TokenSet } from 'openid-client';

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
  let { tokenSet } = request.session.openId;
  if (tokenSet == null) {
    request.session.auth.user = null;
    return;
  }
  if (tokenSet.expired()) {
    try {
      tokenSet = await request.server.openId.client.refresh(
        new TokenSet(tokenSet),
      );
      request.session.openId.tokenSet = tokenSet;
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !error.message.startsWith('invalid_grant')
      ) {
        request.log.warn(error);
      }
      tokenSet = undefined;
      request.session.openId.tokenSet = undefined;
      return;
    }
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
