import { defineStore } from 'pinia';

import { pinia } from './pinia';

const HTTP_STATUS_NO_CONTENT = 204;

interface AuthStatus {
  authId: string;
  name: string;
}

export const useAuthStore = defineStore('auth', () => {
  const status = ref<AuthStatus>();

  async function refresh(): Promise<void> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/whoami`,
        { credentials: 'include' },
      );
      if (response.status === HTTP_STATUS_NO_CONTENT) {
        return;
      }
      status.value = (await response.json()) as AuthStatus;
    } catch (error) {
      console.error(error);
    }
  }

  return {
    name: computed(() => status.value?.name),
    isLoggedIn: computed(() => status.value != null),
    refresh,
  };
});

export async function initAuth(): Promise<void> {
  const authStore = useAuthStore(pinia);
  await authStore.refresh();
}
