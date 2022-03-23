<script lang="ts" setup>
defineProps<{
  label: string;
}>();
</script>

<template>
  <button>
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  @apply inline-flex items-center p-2 rounded-lg text-primary1-900 font-medium select-none;
  @apply hover:bg-primary1-200;
  @apply focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary1-500);
}
</style>
