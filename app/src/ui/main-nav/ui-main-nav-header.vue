<script lang="ts" setup>
defineProps<{
  is?: string;
}>();
</script>

<template>
  <Component
    :is="is ?? 'div'"
    class="text-base pb-2 font-semibold text-gray-600"
  >
    <slot />
  </Component>
</template>
