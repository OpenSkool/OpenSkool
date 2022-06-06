<script lang="ts" setup>
defineProps<{
  title: string;
}>();
</script>

<template>
  <TabPanel
    class="rounded-sm py-2 px-3 focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-dark-700)"
  >
    <slot />
  </TabPanel>
</template>
