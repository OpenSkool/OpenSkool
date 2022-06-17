<script lang="ts" setup>
import { ActionItem } from '~/types';

defineProps<{
  actions: ActionItem[];
}>();
</script>

<template>
  <UiFabMenu v-slot="{ open }">
    <UiFabMenuItems>
      <UiFabMenuItem
        v-for="(action, index) in actions"
        :key="`item-${index}`"
        :action="action.action"
      >
        <template #default>
          {{ action.title }}
        </template>
        <template #icon>
          <UiRemixIcon :icon="action.icon" />
        </template>
      </UiFabMenuItem>
    </UiFabMenuItems>
    <UiMenuButton class="ml-auto">
      <button
        class="rounded-full flex ml-auto bg-primary-300 border-2 h-16 shadow transition ease-in w-16 duration-200 items-center justify-center aspect-square focus:outline-none active:shadow-lg focus-visible:(ring-2 ring-secondary-300 ring-offset-2)"
      >
        <RiCloseLine v-if="open" aria-hidden />
        <RiMenuAddLine v-else aria-hidden />
      </button>
    </UiMenuButton>
  </UiFabMenu>
</template>
