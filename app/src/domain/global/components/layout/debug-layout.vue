<script lang="ts" setup>
import { useBreakpoints } from '~/hooks/use-breakpoints';

const breakpoints = useBreakpoints();
</script>

<template>
  <div class="fixed bottom-0 right-0 p-1 space-y-1 text-sm bg-primary-100">
    <div
      v-for="[name, active] of Object.entries(breakpoints)"
      :key="name"
      class="bg-primary-100"
    >
      <div class="px-1 py-1" :class="{ 'bg-primary-200': active.value }">
        {{ name }}
      </div>
    </div>
  </div>
</template>
