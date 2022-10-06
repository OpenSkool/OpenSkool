import type { ResultOf } from '@graphql-typed-document-node/core';
import { acceptHMRUpdate, defineStore } from 'pinia';

import { apolloClient } from '~/apollo';
import { graphql } from '~/codegen';
import { pinia } from '~/pinia';

const ONE_MINUTE = 60_000;

export const authConnectUrl = new URL(
	'/openid/connect',
	import.meta.env.VITE_API_BASE_URL,
);

export const authLogoutUrl = new URL(
	'/openid/logout',
	import.meta.env.VITE_API_BASE_URL,
);

const AuthCurrentUserDocument = graphql(`
	query authCurrentUser {
		auth {
			abilityRules {
				action
				conditions
				fields
				inverted
				reason
				subject
			}
			currentUser {
				id
				name
				tokenSet {
					refreshToken {
						expiresAt
					}
				}
			}
		}
	}
`);

type Auth = ResultOf<typeof AuthCurrentUserDocument>['auth'];

export const useAuthStore = defineStore('auth', () => {
	const auth = ref<Auth>({
		abilityRules: [],
		currentUser: null,
	});

	function logout(): void {
		window.location.href = authLogoutUrl.toString();
	}

	const refreshTokenTimer = ref<number>();

	async function refresh(): Promise<Auth> {
		clearTimeout(refreshTokenTimer.value);
		try {
			const authQuery = await apolloClient.query({
				query: AuthCurrentUserDocument,
			});
			const previousUser = auth.value.currentUser;
			auth.value = authQuery.data.auth;
			if (auth.value.currentUser) {
				const expiresIn =
					Date.parse(
						auth.value.currentUser.tokenSet.refreshToken.expiresAt as string,
					) -
					Date.now() -
					ONE_MINUTE;
				if (expiresIn < 0) {
					logout();
				} else {
					refreshTokenTimer.value = window.setTimeout(
						() => void refresh(),
						expiresIn,
					);
				}
			} else if (previousUser) {
				logout();
			}
		} catch (error) {
			console.error(error);
		}
		return auth.value;
	}

	return {
		auth,
		name: computed(() => auth.value.currentUser?.name),
		isLoggedIn: computed(() => auth.value.currentUser != null),
		refresh,
	};
});

export async function initAuth(): Promise<Auth> {
	const authStore = useAuthStore(pinia);
	return authStore.refresh();
}

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
