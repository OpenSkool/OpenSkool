<script lang="ts" setup>
import { useAuthStore, authLogoutUrl } from '~/auth';

const authStore = useAuthStore();

const route = useRoute();
const logoutHref = computed(() => {
  const logoutUrl = new URL(authLogoutUrl);
  logoutUrl.searchParams.set('from', route.path);
  return logoutUrl.toString();
});
</script>

<template>
  <UiMenu v-if="authStore.isLoggedIn">
    <UiMenuButton
      is="button"
      class="p-3 border-2 aspect-square rounded-full focus:outline-none focus-visible:(ring-2 rounded-full p-2)"
    >
      <RiUser3Line />
    </UiMenuButton>
    <UiMenuItems>
      <div class="px-4 py-3 text-gray-500">
        You are logged in as
        <strong class="text-gray-800">{{ authStore.name }}</strong>
      </div>
      <UiMenuItem is="a" :href="logoutHref">
        <RiLogoutBoxRLine />
        Logout
      </UiMenuItem>
    </UiMenuItems>
  </UiMenu>
  <AuthConnectButton v-else />
</template>
