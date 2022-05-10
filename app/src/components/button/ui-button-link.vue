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
}>();

const buttonStyles = computed(() => createButtonStyles(props));
</script>

<template>
  <a :class="buttonStyles">
    <slot />
  </a>
</template>
