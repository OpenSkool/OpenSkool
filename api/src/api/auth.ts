import assert from 'node:assert';

import plugin from 'fastify-plugin';

import { prisma } from '~/prisma';

import { AppAbility, buildAbility } from './ability';
import { decodeIdToken } from './openid';

export interface Auth {
  ability: AppAbility;
  user: AuthUser | null;
}

export interface AuthUser {
  id: string;
  name: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    auth: Auth;
  }
}

const ANONYMOUS: Auth = {
  ability: buildAbility(null),
  user: null,
};

export const authPlugin = plugin(async (app) => {
  app.decorateRequest('auth', ANONYMOUS);

  app.addHook('onRequest', async (request) => {
    const { tokenSet } = request.session.openId;
    if (tokenSet == null) {
      request.auth = ANONYMOUS;
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
    const user: AuthUser = {
      id: jwt.sub,
      name: jwt.name,
    };
    request.auth = {
      ability: buildAbility(user.id),
      user,
    };
  });
});
