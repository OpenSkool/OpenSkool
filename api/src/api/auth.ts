import assert from 'assert';

import plugin from 'fastify-plugin';

import { prisma } from '../prisma';
import { decodeIdToken } from './openid';

interface Auth {
  user: AuthUser | null;
}

export interface AuthUser {
  id: string;
  name: string;
}

declare module 'fastify' {
  interface Session {
    auth: Auth;
  }
}

export const authPlugin = plugin(async (app) => {
  app.addHook('onRequest', async (request) => {
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
    request.session.auth.user = {
      id: jwt.sub,
      name: jwt.name,
    };
  });
});
