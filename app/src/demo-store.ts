import { acceptHMRUpdate, defineStore } from 'pinia';

export const useDemoStore = defineStore('demo', () => {
  const demoUserId = ref<string>();

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
