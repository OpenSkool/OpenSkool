<script lang="ts" setup>
defineProps<{
  label: string;
}>();
</script>

<template>
  <button
    class="inline-flex items-center p-2 rounded-lg text-primary1-900 font-medium select-none hover:bg-primary1-200 focus:outline-none"
    focus-visible:ring="2 offset-2 primary1-500"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  @apply focus:outline-none;
}
</style>
