<script lang="ts" setup>
defineProps<{
  is?: string;
}>();
</script>

<template>
  <component :is="is ?? 'div'" class="font-semibold text-secondary-300">
    <slot />
  </component>
</template>
