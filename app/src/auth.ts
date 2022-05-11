import { defineStore } from 'pinia';

import { apolloClient } from '~/apollo';
import {
  AuthCurrentUserDocument,
  AuthCurrentUserQuery,
} from '~/codegen/graphql';
import { pinia } from '~/pinia';

gql`
  query authCurrentUser {
    currentUser {
      id
      abilityRules {
        action
        conditions
        fields
        inverted
        reason
        subject
      }
      name
    }
  }
`;

type AppCurrentUser = AuthCurrentUserQuery['currentUser'];

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<AppCurrentUser>(null);

  async function refresh(): Promise<AppCurrentUser> {
    try {
      const currentUserQuery = await apolloClient.query({
        query: AuthCurrentUserDocument,
      });
      currentUser.value = currentUserQuery.data.currentUser ?? null;
      return currentUser.value;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  return {
    name: computed(() => currentUser.value?.name),
    isLoggedIn: computed(() => currentUser.value != null),
    refresh,
  };
});

export async function initAuth(): Promise<AppCurrentUser> {
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
