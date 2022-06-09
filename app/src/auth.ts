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

const auth = ref<Auth>({
  abilityRules: [],
  currentUser: null,
});

const timer = ref<NodeJS.Timeout>();

export const useAuthStore = defineStore('auth', () => {
  return {
    name: computed(() => auth.value.currentUser?.name),
    isLoggedIn: computed(() => auth.value.currentUser != null),
    refresh,
  };
});

async function refresh(): Promise<Auth> {
  try {
    const authQuery = await apolloClient.query({
      query: AuthCurrentUserDocument,
    });
    auth.value = authQuery.data.auth;
    setSessionExpirationTimer();
    return auth.value;
  } catch (error) {
    console.error(error);
    return {
      abilityRules: [],
      currentUser: null,
    };
  }
}

export function setSessionExpirationTimer(): void {
  const userData = auth.value.currentUser;
  if (userData) {
    const expiresIn = Number(userData.tokenSet.refreshToken.expiresIn);
    if (!Number.isNaN(expiresIn)) {
      if (timer.value) {
        clearTimeout(timer.value);
      }
      timer.value = setTimeout(() => {
        refresh();
      }, expiresIn);
    }
  }
}

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
