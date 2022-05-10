<script lang="ts" setup>
import { createButtonStyles } from './helpers';

const props = defineProps<{
  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'caution'
    | 'danger'
    | 'success';
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
