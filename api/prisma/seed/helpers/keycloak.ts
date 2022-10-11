import assert from 'node:assert';

import KeycloakAdminClient from '@keycloak/keycloak-admin-client';

assert(process.env.AUTH_CLIENT_ID);
export const kcAdminClient = new KeycloakAdminClient({
	baseUrl: process.env.AUTH_BASE_URL,
	realmName: process.env.AUTH_REALM_NAME,
});
await kcAdminClient.auth({
	clientId: process.env.AUTH_CLIENT_ID,
	clientSecret: process.env.AUTH_CLIENT_SECRET,
	grantType: 'client_credentials',
});

export const realm = await nonNullable(async () => {
	const [realm] = await kcAdminClient.realms.find();
	return realm;
});

export const firstUser = await nonNullable(() => kcAdminClient.users.findOne());

export const users = await kcAdminClient.users.find();

async function nonNullable<T>(
	exec: () => Promise<T | null | undefined>,
): Promise<T> {
	const value = await exec();
	assert(value);
	return value;
}
