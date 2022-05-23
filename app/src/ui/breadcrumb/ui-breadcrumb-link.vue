<script lang="ts" setup>
defineProps<{
  to: string;
}>();
</script>

<template>
  <li class="inline text-gray-600 text-sm uppercase">
    <RouterLink class="hover:underline" :to="to">
      <slot />
    </RouterLink>
  </li>
</template>

<style scoped>
li + li::before {
  @apply mx-5 text-gray-400;
  content: '/';
}
</style>
