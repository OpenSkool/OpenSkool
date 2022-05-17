<script lang="ts" setup>
defineProps<{
  is?: string;
}>();
</script>

<template>
  <Component :is="is ?? 'div'" class="font-semibold text-gray-600 uppercase">
    <slot />
  </Component>
</template>
