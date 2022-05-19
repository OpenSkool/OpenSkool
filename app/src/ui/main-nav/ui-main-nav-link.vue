<script lang="ts" setup>
defineProps<{ to: string }>();
</script>

<template>
  <li class="flex pb-1">
    <RouterLink
      :to="to"
      :class="[
        'flex-1 py-3 px-5 rounded-2xl bg-gray-300/0',
        'hover:bg-opacity-75 active:bg-opacity-100',
        'focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-secondary-400)',
      ]"
    >
      <slot />
    </RouterLink>
  </li>
</template>

<style scoped>
.router-link-active {
  @apply bg-secondary-200/50 font-medium;
}
</style>
