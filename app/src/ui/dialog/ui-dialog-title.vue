<script lang="ts" setup>
import UiTitle from '../title/ui-title.vue';
</script>

<template>
  <DialogTitle>
    <UiTitle class="text-lg" v-bind="$attrs">
      <slot />
    </UiTitle>
  </DialogTitle>
</template>
