<script lang="ts" setup>
import { i18nLoaderService } from '~/i18n';

import { useMenuState } from './use-menu-state';

await i18nLoaderService.loadGlobalMessages();

const { menuState, toggleMenu } = useMenuState();
</script>

<template>
  <div class="root grid">
    <div class="col-span-2 flex items-center justify-between p-3">
      <MainMenuToggleButton
        aria-controls="mainMenu"
        :aria-expanded="menuState.opened"
        @click="toggleMenu()"
      />
      <LoadingSpinner />
      <div class="flex gap-3">
        <LanguageSelect />
        <UserMenu />
      </div>
    </div>
    <MainMenu id="mainMenu" :state="menuState" />
    <div
      class="mb-10 bg-gray-100"
      :class="menuState.overlay || !menuState.opened ? 'col-span-2' : ''"
    >
      <main class="container mx-auto p-10">
        <Suspense>
          <RouterView />
        </Suspense>
      </main>
    </div>
    <!-- <DebugLayout /> -->
  </div>
</template>

<style scoped>
.root {
  grid-template-columns: 30ch 1fr;
}
</style>
