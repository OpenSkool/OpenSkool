<script lang="ts" setup>
defineProps<{
  value: number | object | string;
}>();
</script>

<template>
  <ListboxOption
    v-slot="{ active, disabled, selected }"
    :value="value"
    as="template"
  >
    <li
      :class="[
        'cursor-default select-none relative py-2 pl-10 pr-4',
        active ? 'text-amber-900 bg-amber-100' : 'text-gray-900',
      ]"
    >
      <div class="truncate" :class="selected ? 'font-medium' : 'font-normal'">
        <slot v-bind="{ active, disabled, selected }"></slot>
      </div>
      <span
        v-if="selected"
        class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
      >
        <ri-check-fill aria-hidden="true" class="w-5 h-5" />
      </span>
    </li>
  </ListboxOption>
</template>
