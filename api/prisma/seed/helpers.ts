import assert from 'node:assert';

import { faker } from '@faker-js/faker';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';

export async function getUsers(): Promise<UserRepresentation[]> {
  assert(process.env.AUTH_CLIENT_ID);
  const kcAdminClient = new KcAdminClient({
    baseUrl: process.env.AUTH_BASE_URL,
    realmName: process.env.AUTH_REALM_NAME,
  });
  await kcAdminClient.auth({
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    grantType: 'client_credentials',
  });
  return kcAdminClient.users.find();
}

export function generateFakeRange(): [Date, Date] {
  const from = generateFutureDate();
  return [from, generateFutureDate(from)];
}

export function generateFutureDate(reference?: Date): Date {
  const date = faker.date.future(1, reference);
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date;
}
