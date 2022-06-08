<script lang="ts" setup>
import { Action } from '~/types';

defineProps<{
  action: Action;
}>();
</script>

<template>
  <MenuItem v-slot="{ active, disabled }">
    <Component
      :is="typeof action === 'string' ? 'RouterLink' : 'button'"
      class="flex items-center py-3 rounded-md"
      :class="{ active: active }"
      :to="typeof action === 'string' ? action : undefined"
      v-on="typeof action !== 'string' ? { click: action } : {}"
    >
      <div
        :class="[
          'inline-block py-2 px-3 text-sm font-medium text-white rounded-lg shadow-sm',
          active ? 'active bg-primary-200 text-gray-900' : 'bg-gray-900',
        ]"
      >
        <slot v-bind="{ active, disabled }" />
      </div>
      <RiArrowRightSFill
        :class="[
          'ml-[-11px] text-gray-900 inline-block text-lg',
          { 'text-primary-200': active },
        ]"
      />
      <div
        class="icon mr-2 bg-gray-400 p-0 w-12 h-12 rounded-full active:shadow-lg shadow transition ease-in duration-200 focus:outline-none"
      >
        <slot name="icon" v-bind="{ active, disabled }" />
      </div>
    </Component>
  </MenuItem>
</template>

<style scoped>
:deep() .icon svg {
  @apply m-auto h-full;
}
</style>
