<script lang="ts" setup>
defineProps<{ active?: boolean }>();
</script>

<template>
  <button
    :class="[
      'w-full flex gap-2 items-center p-2 rounded-md',
      active ? 'bg-amber-500 text-white' : 'text-gray-900',
    ]"
  >
    <slot></slot>
  </button>
</template>
