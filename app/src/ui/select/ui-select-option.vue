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
          ? 'text-dark-800 bg-primary-100'
          : 'text-dark-900',
      ]"
    >
      <div class="truncate" :class="selected ? 'font-medium' : 'font-normal'">
        <slot v-bind="{ active, disabled, selected }" />
      </div>
      <span
        v-if="selected"
        class="flex pl-3 inset-y-0 left-0 text-primary-700 absolute items-center"
      >
        <RiCheckLine aria-hidden class="h-5 w-5" />
      </span>
    </li>
  </ListboxOption>
</template>
