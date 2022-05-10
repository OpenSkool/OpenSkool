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
  disabled?: boolean;
  outline?: boolean;
}>();

const buttonStyles = computed(() => createButtonStyles(props));
</script>

<template>
  <button :class="buttonStyles" :disabled="disabled" type="button">
    <slot />
  </button>
</template>
