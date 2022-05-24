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
    <UiMenuButton>
      <button
        :class="[
          'p-3 border-2 aspect-square rounded-full',
          'focus:outline-none focus-visible:(ring-2 ring-secondary-300 ring-offset-2)',
          'flex items-center justify-center',
        ]"
      >
        <RiUser3Line aria-hidden />
        <span v-t="'global.widget.userMenu.toggleButton'" class="sr-only" />
      </button>
    </UiMenuButton>
    <UiMenuItems>
      <i18n-t
        class="px-4 py-3 text-base text-gray-500"
        keypath="global.widget.userMenu.description"
        tag="div"
      >
        <template #name>
          <strong class="text-gray-800">{{ authStore.name }}</strong>
        </template>
      </i18n-t>
      <UiMenuItem is="a" class="text-base" :href="logoutHref">
        <RiLogoutBoxRLine aria-hidden />
        <span v-t="'global.widget.userMenu.logoutButton'" />
      </UiMenuItem>
    </UiMenuItems>
  </UiMenu>
  <AuthConnectButton v-else />
</template>
