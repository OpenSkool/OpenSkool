<script lang="ts" setup>
import type { AnyComponent } from '~/types';

defineProps<{
  is?: string | AnyComponent;
}>();
</script>

<template>
  <MenuItem v-slot="{ active, disabled }">
    <Component
      :is="is ?? 'button'"
      :class="[
        'w-full flex gap-3 items-center px-4 py-3 rounded-md',
        { 'bg-primary-200': active },
      ]"
    >
      <slot v-bind="{ active, disabled }" />
    </Component>
  </MenuItem>
</template>
