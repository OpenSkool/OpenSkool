<script lang="ts" setup>
defineProps<{
  title: string;
}>();
</script>

<template>
  <TabPanel><slot /></TabPanel>
</template>
