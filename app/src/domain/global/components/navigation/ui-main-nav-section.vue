<script lang="ts" setup>
defineProps<{
  name: string;
}>();
</script>

<template>
  <div class="px-5 py-1">
    <UiMainNavHeader>{{ name }}</UiMainNavHeader>
    <slot />
    <div class="w-full border-b-4 border-gray-300 my-3" />
  </div>
</template>
