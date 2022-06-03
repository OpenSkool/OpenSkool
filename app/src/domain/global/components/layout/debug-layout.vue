<script lang="ts" setup>
import { useBreakpoints } from '../../../../hooks/use-breakpoints';

const breakpoints = useBreakpoints();
</script>

<template>
  <div class="fixed bg-primary-100 bottom-0 right-0 p-1 space-y-1 text-sm">
    <div
      v-for="[name, active] of Object.entries(breakpoints)"
      :key="name"
      class=""
    >
      <div class="px-1 py-1" :class="{ 'bg-primary-100': active.value }">
        {{ name }}
      </div>
    </div>
  </div>
</template>
