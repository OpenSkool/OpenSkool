<script lang="ts" setup>
import { useGlobalQueryLoading } from '@vue/apollo-composable';

import { useAuthStore, authConnectUrl, authLogoutUrl } from '~/auth';

const authStore = useAuthStore();

const route = useRoute();
const connectHref = computed(() => {
  const connectUrl = new URL(authConnectUrl);
  connectUrl.searchParams.set('from', route.path);
  return connectUrl.toString();
});
const logoutHref = computed(() => {
  const connectUrl = new URL(authLogoutUrl);
  connectUrl.searchParams.set('from', route.path);
  return connectUrl.toString();
});

const loading = useGlobalQueryLoading();
</script>

<template>
  <div class="bg-white">
    <div class="flex items-center justify-end p-3">
      <div class="flex gap-8">
        <LanguageSelect />
        <div class="flex gap-3 items-center text-base">
          <div class="flex gap-2 items-center">
            <RiShieldUserFill />
            <template v-if="authStore.isLoggedIn">
              {{ authStore.name }}
            </template>
          </div>
          <UiButtonLink v-if="authStore.isLoggedIn" :href="logoutHref">
            Logout
          </UiButtonLink>
          <UiButtonLink v-else :href="connectHref">Connect</UiButtonLink>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="absolute -ml-12 mt-1 left-1/2 top-1/2">
      <TransitionRoot
        :show="loading"
        enter="duration-100 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="delay-300 duration-100 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <RiLoaderFill class="text-xl text-tertiary-300 spin" />
      </TransitionRoot>
    </div>
    <div class="flex gap-5">
      <UiMainNav>
        <UiMainNavLink to="/">Home</UiMainNavLink>
        <UiMainNavLink to="/demo/forms">Forms</UiMainNavLink>
        <UiMainNavLink to="/demo/ui">UI</UiMainNavLink>
        <UiMainNavLink to="/manage/frameworks">Manage frameworks</UiMainNavLink>
      </UiMainNav>
      <div class="container mx-auto px-5 mt-5">
        <Suspense>
          <RouterView />
        </Suspense>
      </div>
    </div>
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
