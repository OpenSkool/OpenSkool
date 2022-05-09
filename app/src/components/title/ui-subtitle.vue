<script lang="ts" setup>
defineProps<{
  is?: string;
}>();
</script>

<template>
  <component :is="is ?? 'div'" class="font-semibold text-gray-600 uppercase">
    <slot />
  </component>
</template>
