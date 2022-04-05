import routes from 'virtual:generated-pages';
import { createRouter, createWebHistory } from 'vue-router';

import { useDemoStore } from '~/demo-store';
import { pinia } from '~/pinia';

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeResolve((to) => {
  const demoStore = useDemoStore(pinia);
  if (to.meta.requireDemoUser === true && demoStore.demoUserId == null) {
    return '/401';
  }
});
