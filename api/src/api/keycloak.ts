import assert from 'node:assert';

import KcAdminClient from '@keycloak/keycloak-admin-client';
import { asValue } from 'awilix';
import plugin from 'fastify-plugin';
import { decodeJwt } from 'jose';
import pLimit from 'p-limit';

const ONE_SECOND = 1000;
const EXPIRE_MARGIN = 5;

const singleConcurrency = pLimit(1);

export type KeycloakAdminExecute = <T>(
  executor: (client: KcAdminClient) => T,
) => T;

declare module '@fastify/awilix' {
  interface Cradle {
    keycloakAdminExecute: KeycloakAdminExecute;
  }
  interface RequestCradle {
    keycloakUserClient: KcAdminClient;
  }
}

export const keycloakPlugin = plugin(async (app) => {
  const kcAdminClient = new KcAdminClient({
    baseUrl: app.config.AUTH_BASE_URL,
    realmName: app.config.AUTH_REALM_NAME,
  });

  let singletonAdminTokenExpiresAt = 0;
  async function assertSingletonAdminToken(): Promise<void> {
    const now = Math.floor(Date.now() / ONE_SECOND);
    if (now > singletonAdminTokenExpiresAt - EXPIRE_MARGIN) {
      await kcAdminClient.auth({
        clientId: app.config.AUTH_CLIENT_ID,
        clientSecret: app.config.AUTH_CLIENT_SECRET,
        grantType: 'client_credentials',
      });
      assert(kcAdminClient.accessToken, 'accessToken is null');
      const token = decodeJwt(kcAdminClient.accessToken);
      assert(token.exp, 'token.exp is null');
      singletonAdminTokenExpiresAt = token.exp; // eslint-disable-line require-atomic-updates
    }
  }

  app.diContainer.register(
    'keycloakAdminExecute',
    asValue(
      async <T extends (kcAdminClient: KcAdminClient) => R, R>(
        executor: T,
      ): Promise<R> => {
        await singleConcurrency(assertSingletonAdminToken);
        return executor(kcAdminClient);
      },
    ),
  );

  app.addHook('onRequest', async (request) => {
    const kcUserClient = new KcAdminClient({
      baseUrl: app.config.AUTH_BASE_URL,
      realmName: app.config.AUTH_REALM_NAME,
    });
    const accessToken = request.session.openId.tokenSet?.access_token;
    if (accessToken != null) {
      kcUserClient.setAccessToken(accessToken);
    }
    request.diScope.register('keycloakUserClient', asValue(kcUserClient));
  });
});
