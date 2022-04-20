import routes from 'virtual:generated-pages';
import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '~/auth';
import { pinia } from '~/pinia';

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeResolve((to) => {
  const authStore = useAuthStore(pinia);
  if (to.meta.requireAuthentication === true && !authStore.isLoggedIn) {
    return '/401';
  }
});
