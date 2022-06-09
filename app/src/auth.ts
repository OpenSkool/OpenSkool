import { defineStore } from 'pinia';

import { apolloClient } from '~/apollo';
import {
  AuthCurrentUserDocument,
  AuthCurrentUserQuery,
} from '~/codegen/graphql';
import { pinia } from '~/pinia';

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
            expiresIn
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

  async function refresh(): Promise<Auth> {
    try {
      const authQuery = await apolloClient.query({
        query: AuthCurrentUserDocument,
      });
      auth.value = authQuery.data.auth;
      setSessionExpirationTimer(auth.value);
      return auth.value;
    } catch (error) {
      console.error(error);
      return {
        abilityRules: [],
        currentUser: null,
      };
    }
  }

  function setSessionExpirationTimer(authData: Auth | undefined): void {
    const userData = authData?.currentUser;
    const EXTRA_DELAY = 1000;
    if (userData) {
      const expiresIn = Number(userData.tokenSet.refreshToken.expiresIn);
      if (!Number.isNaN(expiresIn)) {
        setTimeout(() => {
          refresh();
        }, expiresIn + EXTRA_DELAY);
      }
    }
  }

  return {
    name: computed(() => auth.value.currentUser?.name),
    isLoggedIn: computed(() => auth.value.currentUser != null),
    refresh,
    setSessionExpirationTimer,
  };
});

export async function initAuth(): Promise<Auth> {
  const authStore = useAuthStore(pinia);
  return authStore.refresh();
}

export const authConnectUrl = new URL(
  '/openid/connect',
  import.meta.env.VITE_API_BASE_URL,
);

export const authLogoutUrl = new URL(
  '/openid/logout',
  import.meta.env.VITE_API_BASE_URL,
);
