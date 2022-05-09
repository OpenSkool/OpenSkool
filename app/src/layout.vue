<script lang="ts" setup>
import { useGlobalQueryLoading } from '@vue/apollo-composable';

import { useAuthStore } from './auth';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const authStore = useAuthStore();
const loading = useGlobalQueryLoading();
const route = useRoute();
</script>

<template>
  <div class="container mx-auto px-5">
    <div class="relative">
      <div class="flex items-center justify-between">
        <div class="absolute -ml-12 mt-1">
          <TransitionRoot
            :show="loading"
            enter="duration-100 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="delay-300 duration-100 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <ri-loader-fill class="text-xl text-tertiary-300 spin" />
          </TransitionRoot>
        </div>
        <h1 v-t="'global.title'" class="text-3xl my-5 text-secondary-300"></h1>
        <div class="flex gap-8">
          <language-select />
          <div class="flex gap-3 items-center text-base">
            <div class="flex gap-2 items-center">
              <ri-shield-user-fill />
              <template v-if="authStore.isLoggedIn">
                {{ authStore.name }}
              </template>
            </div>
            <a
              v-if="authStore.isLoggedIn"
              class="btn btn-primary"
              :href="`${apiBaseUrl}/openid/logout?from=${route.path}`"
            >
              Logout
            </a>
            <a
              v-else
              class="btn btn-primary"
              :href="`${apiBaseUrl}/openid/connect?from=${route.path}`"
            >
              Connect
            </a>
          </div>
        </div>
      </div>
    </div>
    <nav class="my-5 text-base">
      <ol class="flex gap-5">
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/demo/forms">Forms</router-link>
        </li>
        <li>
          <router-link to="/demo/ui">UI</router-link>
        </li>
        <li>
          <router-link to="/manage/frameworks"> Manage frameworks </router-link>
        </li>
      </ol>
    </nav>
    <suspense>
      <router-view />
    </suspense>
  </div>
</template>

<style scoped>
:global(html, body) {
  @apply antialiased font-sans bg-gray-100;
}

:global(a) {
  @apply text-primary-600;
}

.spin {
  animation: spin 1.25s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
