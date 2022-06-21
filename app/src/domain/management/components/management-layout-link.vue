<script lang="ts" setup>
import type { FunctionalComponent, SVGAttributes } from 'vue';
import { RouterLink } from 'vue-router';

import ManagementLayoutItem from './management-layout-item.vue';

defineProps<{
  icon: FunctionalComponent<SVGAttributes>;
}>();
</script>

<template>
  <ManagementLayoutItem :is="RouterLink" :icon="icon">
    <slot />
  </ManagementLayoutItem>
</template>
