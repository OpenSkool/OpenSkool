<script lang="ts" setup>
import { i18nLoaderService } from '~/i18n';

// import DebugLayout from './debug-layout.vue';
import LanguageSelect from './language-select.vue';
import LoadingSpinner from './loading-spinner.vue';
import MainMenuToggleButton from './main-menu/main-menu-toggle-button.vue';
import MainMenu from './main-menu/main-menu.vue';
import { useMenuState } from './main-menu/use-menu-state';
import UserMenu from './user-menu.vue';

await i18nLoaderService.loadGlobalMessages();

const { menuState, toggleMenu } = useMenuState();
</script>

<template>
  <!-- <DebugLayout /> -->
  <div class="grid">
    <div class="flex p-3 col-span-2 items-center justify-between">
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
      class="bg-gray-100 mb-10"
      :class="menuState.overlay || !menuState.opened ? 'col-span-2' : ''"
    >
      <main class="container mx-auto p-10">
        <Suspense>
          <RouterView />
        </Suspense>
      </main>
    </div>
  </div>
</template>

<style scoped>
.grid {
  grid-template-columns: 30ch 1fr;
}
</style>
