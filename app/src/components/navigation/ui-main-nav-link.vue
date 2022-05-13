<script lang="ts" setup>
defineProps<{ to: string }>();
</script>

<template>
  <li>
    <RouterLink :to="to">
      <slot />
    </RouterLink>
  </li>
</template>
