import { defineStore } from 'pinia';

import { apolloClient } from '~/apollo';
import {
  AuthCurrentUserDocument,
  AuthCurrentUserQuery,
} from '~/codegen/graphql';
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

gql`
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
`;

type Auth = AuthCurrentUserQuery['auth'];

export const useAuthStore = defineStore('auth', () => {
  const auth = ref<Auth>({
    abilityRules: [],
    currentUser: null,
  });

  const refreshTokenTimer = ref<number>();

  async function refresh(): Promise<Auth> {
    clearTimeout(refreshTokenTimer.value);
    try {
      const authQuery = await apolloClient.query({
        query: AuthCurrentUserDocument,
      });
      auth.value = authQuery.data.auth;
      if (auth.value.currentUser) {
        const expiresIn =
          Date.parse(
            auth.value.currentUser.tokenSet.refreshToken.expiresAt as string,
          ) -
          Date.now() -
          ONE_MINUTE;
        if (expiresIn < 0) {
          throw new Error('session expired');
        }
        refreshTokenTimer.value = window.setTimeout(
          () => void refresh(),
          expiresIn,
        );
      }
    } catch {
      window.location.href = authLogoutUrl.toString();
    }
    return auth.value;
  }

  return {
    name: computed(() => auth.value.currentUser?.name),
    isLoggedIn: computed(() => auth.value.currentUser != null),
    refresh,
  };
});

export async function initAuth(): Promise<Auth> {
  const authStore = useAuthStore(pinia);
  return authStore.refresh();
}
