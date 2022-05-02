import { defineStore } from 'pinia';

import { apolloClient } from '~/apollo';
import { AuthCurrentUserDocument, CurrentUser } from '~/codegen/graphql';
import { pinia } from '~/pinia';

gql`
  query authCurrentUser {
    currentUser {
      id
      name
    }
  }
`;

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<CurrentUser | null>(null);

  async function refresh(): Promise<void> {
    try {
      const currentUserQuery = await apolloClient.query({
        query: AuthCurrentUserDocument,
      });
      currentUser.value = currentUserQuery.data.currentUser ?? null;
    } catch (error) {
      console.error(error);
    }
  }

  return {
    name: computed(() => currentUser.value?.name),
    isLoggedIn: computed(() => currentUser.value != null),
    refresh,
  };
});

export async function initAuth(): Promise<void> {
  const authStore = useAuthStore(pinia);
  await authStore.refresh();
}
