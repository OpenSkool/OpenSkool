import { useLocalStorage } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';

export const useDemoStore = defineStore('demo', () => {
  const demoUserId = useLocalStorage<string | undefined>(
    'os-demo-user-id',
    null,
  );

  return {
    demoUserId,
    setDemoUserId(id: string | undefined): void {
      demoUserId.value = id;
    },
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDemoStore, import.meta.hot));
}
