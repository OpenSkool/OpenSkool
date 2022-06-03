<script lang="ts" setup>
defineProps<{
  label: string;
}>();
</script>

<template>
  <button
    class="inline-flex items-center p-2 rounded-lg select-none text-primary-600 hover:bg-primary-200 focus:outline-none"
    focus-visible:ring="2 offset-2 primary-500"
  >
    <slot />
  </button>
</template>
