<script lang="ts" setup>
import LanguageSelect from '~/domain/global/components/layout/language-select.vue';
import LoadingSpinner from '~/domain/global/components/layout/loading-spinner.vue';
import MainMenuToggleButton from '~/domain/global/components/layout/main-menu-toggle-button.vue';
import MainMenu from '~/domain/global/components/layout/main-menu.vue';
import UserMenu from '~/domain/global/components/layout/user-menu.vue';
import { i18nLoaderService } from '~/i18n';

import { useMenuState } from './use-menu-state';

await i18nLoaderService.loadGlobalMessages();

const { menuState, toggleMenu } = useMenuState();
</script>

<template>
  <div class="grid">
    <div class="flex items-center justify-between col-span-2 p-3">
      <MainMenuToggleButton
        aria-controls="mainMenu"
        :aria-expanded="menuState.opened"
        @click="toggleMenu()"
      />
      <LoadingSpinner />
      <div class="flex gap-3">
        <LanguageSelect class="hidden md:block" />
        <UserMenu />
      </div>
    </div>
    <MainMenu id="mainMenu" :state="menuState" />
    <div
      class="mb-10 bg-gray-100"
      :class="menuState.overlay || !menuState.opened ? 'col-span-2' : ''"
    >
      <main class="container p-10 mx-auto">
        <Suspense>
          <RouterView />
        </Suspense>
      </main>
    </div>
    <!-- <DebugLayout /> -->
  </div>
</template>

<style scoped>
.grid {
  grid-template-columns: 30ch 1fr;
}
</style>
