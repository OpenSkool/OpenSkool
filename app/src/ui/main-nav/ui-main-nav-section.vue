<script lang="ts" setup>
defineProps<{
  name: string;
}>();
</script>

<template>
  <ul class="px-5 py-1">
    <UiMainNavHeader>{{ name }}</UiMainNavHeader>
    <slot />
    <div class="w-full border-b-1 border-gray-300 my-3" />
  </ul>
</template>
