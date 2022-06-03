<script lang="ts" setup>
import { createButtonStyles } from './helpers';

const props = defineProps<{
  color?: 'primary' | 'danger';
  outline?: boolean;
  size?: 'sm' | 'base';
}>();

const buttonStyles = computed(() => createButtonStyles(props));
</script>

<template>
  <RouterLink :class="buttonStyles">
    <slot />
  </RouterLink>
</template>
