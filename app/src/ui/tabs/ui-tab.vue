<script lang="ts" setup>
defineProps<{
  id: string;
  title: string;
}>();
</script>

<template>
  <TabPanel><slot /></TabPanel>
</template>
