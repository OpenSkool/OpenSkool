<script lang="ts" setup>
defineProps<{
  title: string;
}>();
</script>

<template>
  <TabPanel
    class="px-3 py-2 rounded-sm focus:outline-none focus-visible:(ring-2 ring-offset-2)"
  >
    <slot />
  </TabPanel>
</template>
