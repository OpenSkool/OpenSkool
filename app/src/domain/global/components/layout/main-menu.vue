<script lang="ts" setup>
import imgUrl from './backpack.png';
import type { MenuState } from './use-menu-state';

defineProps<{
  state: MenuState;
}>();
</script>

<template>
  <div class="relative">
    <UiMainNav
      v-show="state.opened"
      class="bg-white"
      :class="{
        'fixed z-10 w-screen h-screen': state.opened && state.overlay,
      }"
    >
      <header class="-mb-5">
        <RouterLink class="flex gap-3 items-center justify-center" to="/">
          <img class="inline-block" :src="imgUrl" />
          <div
            v-t="'global.title'"
            class="font-normal text-secondary-300 text-xl"
          />
        </RouterLink>
      </header>
      <UiMainNavSection>
        <UiMainNavHeader>
          <span v-t="'global.mainMenu.managementHeader'" />
        </UiMainNavHeader>
        <UiMainNavLink
          v-t="'global.mainMenu.managementLink.competencyFrameworks'"
          to="/manage/frameworks"
        />
      </UiMainNavSection>
      <UiMainNavSection>
        <UiMainNavHeader>Demo</UiMainNavHeader>
        <UiMainNavLink to="/demo/forms">Forms</UiMainNavLink>
        <UiMainNavLink to="/demo/ui">UI</UiMainNavLink>
      </UiMainNavSection>
    </UiMainNav>
  </div>
</template>

<style scoped>
header img {
  max-height: 2em;
}
</style>
