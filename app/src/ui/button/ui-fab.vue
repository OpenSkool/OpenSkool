<script lang="ts" setup>
import { ActionItem } from '~/types';

defineProps<{
  actions: ActionItem[];
  actionsLabel: string;
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
        :class="[
          'flex items-center justify-center',
          'bg-primary-300 w-16 h-16 shadow ml-auto',
          'border-2 aspect-square rounded-full',
          'active:shadow-lg transition ease-in duration-200',
          'focus:outline-none focus-visible:(ring-2 ring-secondary-300 ring-offset-2)',
        ]"
      >
        <RiCloseLine v-if="open" />
        <RiMenuAddLine v-else />
        <span class="sr-only">{{ actionsLabel }}</span>
      </button>
    </UiMenuButton>
  </UiFabMenu>
</template>
