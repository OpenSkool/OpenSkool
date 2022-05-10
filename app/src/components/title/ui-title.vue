<script lang="ts" setup>
defineProps<{
  is?: string;
}>();
</script>

<template>
  <Component :is="is ?? 'div'" class="font-semibold text-secondary-300">
    <slot />
  </Component>
</template>
