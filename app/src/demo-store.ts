import { acceptHMRUpdate, defineStore } from 'pinia';

export const useDemoStore = defineStore('demo', () => {
  const activeUserId = ref<string>();

  return {
    activeUserId,
    setActiveUserId(id: string | undefined): void {
      activeUserId.value = id;
    },
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDemoStore, import.meta.hot));
}
