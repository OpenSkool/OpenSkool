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
      class="rounded-md flex py-3 items-center"
      :class="{ active: active }"
      :to="typeof action === 'string' ? action : undefined"
      v-on="typeof action !== 'string' ? { click: action } : {}"
    >
      <div
        class="rounded-lg font-medium shadow-sm text-sm text-white py-2 px-3 inline-block"
        :class="active ? 'active bg-primary-200 text-gray-900' : 'bg-gray-900'"
      >
        <slot v-bind="{ active, disabled }" />
      </div>
      <RiArrowRightSFill
        class="text-lg ml-[-11px] text-gray-900 inline-block"
        :class="{ 'text-primary-200': active }"
      />
      <div
        class="rounded-full bg-gray-400 h-12 shadow mr-2 p-0 transition ease-in w-12 duration-200 icon focus:outline-none active:shadow-lg"
      >
        <slot name="icon" v-bind="{ active, disabled }" />
      </div>
    </Component>
  </MenuItem>
</template>

<style scoped>
:deep() .icon svg {
  @apply h-full m-auto;
}
</style>
