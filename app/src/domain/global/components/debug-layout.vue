<script lang="ts" setup>
import { useBreakpoints } from '~/hooks/use-breakpoints';

const breakpoints = useBreakpoints();
</script>

<template>
  <div class="space-y-1 bg-primary-100 text-sm p-1 right-0 bottom-0 fixed">
    <div
      v-for="[name, active] of Object.entries(breakpoints)"
      :key="name"
      class="bg-primary-100"
    >
      <div class="py-1 px-1" :class="{ 'bg-primary-200': active.value }">
        {{ name }}
      </div>
    </div>
  </div>
</template>
