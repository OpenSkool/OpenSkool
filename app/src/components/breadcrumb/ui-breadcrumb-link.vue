<script lang="ts" setup>
defineProps<{ to: string }>();
</script>

<template>
  <li class="uppercase text-gray-600 text-sm">
    <RouterLink :to="to">
      <slot />
    </RouterLink>
  </li>
</template>
