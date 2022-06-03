<script lang="ts" setup>
import { createButtonStyles } from './helpers';

const props = defineProps<{
  color?: 'primary' | 'danger';
  disabled?: boolean;
  outline?: boolean;
  size?: 'sm' | 'base';
}>();

const buttonStyles = computed(() => createButtonStyles(props));
</script>

<template>
  <button :class="buttonStyles" :disabled="disabled" type="button">
    <slot />
  </button>
</template>
