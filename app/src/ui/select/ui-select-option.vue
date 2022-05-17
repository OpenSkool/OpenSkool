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
        'cursor-default select-none relative py-2 px-10',
        disabled
          ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
          : active
          ? 'text-gray-800 bg-secondary-100'
          : 'text-gray-900',
      ]"
    >
      <div class="truncate" :class="selected ? 'font-medium' : 'font-normal'">
        <slot v-bind="{ active, disabled, selected }" />
      </div>
      <span
        v-if="selected"
        class="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600"
      >
        <RiCheckLine aria-hidden="true" class="w-5 h-5" />
      </span>
    </li>
  </ListboxOption>
</template>
