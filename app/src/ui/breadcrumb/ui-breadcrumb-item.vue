<script lang="ts" setup>
defineProps<{
  linkTo?: string;
}>();
</script>

<template>
  <li class="inline text-gray-600 text-sm uppercase">
    <RouterLink v-if="linkTo" class="hover:underline" :to="linkTo">
      <slot />
    </RouterLink>
    <template v-else>
      <slot />
    </template>
  </li>
</template>

<style scoped>
li + li::before {
  @apply mx-5 text-gray-400;
  content: '/';
}
</style>
