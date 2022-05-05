import { defineStore } from 'pinia';

import { apolloClient } from '~/apollo';
import { AuthCurrentUserDocument, CurrentUser } from '~/codegen/graphql';
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

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<CurrentUser | null>(null);

  async function refresh(): Promise<CurrentUser | null> {
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

export async function initAuth(): Promise<CurrentUser | null> {
  const authStore = useAuthStore(pinia);
  return authStore.refresh();
}
