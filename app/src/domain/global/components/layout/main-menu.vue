<script lang="ts" setup>
import backpackImageUrl from './backpack.png';
import type { MenuState } from './use-menu-state';

defineProps<{
  state: MenuState;
}>();
</script>

<template>
  <div class="relative">
    <Transition
      enter-active-class="absolute transition transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="absolute transition transform"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <UiMainNav
        v-if="state.opened"
        class="bg-white"
        :class="{
          'fixed z-10 w-screen h-screen': state.opened && state.overlay,
        }"
      >
        <header class="-mb-5">
          <RouterLink
            class="flex gap-3 items-center justify-center rounded-md focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary-700)"
            to="/"
          >
            <img
              alt="OpenSkool logo backpack line art"
              class="my-2 inline-block"
              :src="backpackImageUrl"
            />
            <div
              v-t="'global.title'"
              class="font-normal text-primary-400 text-xl"
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
    </Transition>
  </div>
</template>

<style scoped>
header img {
  max-height: 2em;
}
</style>
