<script lang="ts" setup>
defineProps<{
  is?: string;
}>();
</script>

<template>
  <Component :is="is ?? 'div'" class="font-semibold text-primary-500">
    <slot />
  </Component>
</template>
