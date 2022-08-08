import { AppAbility } from '@os/ability';
import plugin from 'fastify-plugin';

import { prisma } from '~/prisma';

import { buildAbility } from './ability';
import { AuthUser, parseAccessToken } from './types';

export interface Auth {
  ability: AppAbility;
  user: AuthUser | null;
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
  app.decorateRequest('auth', null);

  app.addHook('onRequest', async (request) => {
    const { tokenSet } = request.session.openId;
    if (tokenSet == null) {
      request.auth = ANONYMOUS;
      return;
    }
    const accessToken = parseAccessToken(tokenSet.access_token);
    const existingUser = await prisma.user.findUnique({
      select: { id: true },
      where: { id: accessToken.sub },
    });
    if (existingUser == null) {
      await prisma.user.create({
        data: {
          id: accessToken.sub,
          name: accessToken.preferred_username,
        },
      });
    }
    const user: AuthUser = {
      id: accessToken.sub,
      name: accessToken.preferred_username,
    };
    request.auth = {
      ability: buildAbility(user),
      user,
    };
  });
});
