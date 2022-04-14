import { defineStore } from 'pinia';

import { pinia } from './pinia';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  return {
    isLoggedIn,
    setIsLoggedIn(value: boolean): void {
      isLoggedIn.value = value;
    },
  };
});

export async function initAuth(): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/openid/status`,
    { credentials: 'include' },
  );
  const { isLoggedIn } = (await response.json()) as { isLoggedIn: boolean };
  const authStore = useAuthStore(pinia);
  authStore.setIsLoggedIn(isLoggedIn);
}
