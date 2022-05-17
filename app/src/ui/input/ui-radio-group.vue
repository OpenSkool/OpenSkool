<script lang="ts" setup>
import type { InputOption, InputValue } from './types';

defineProps<{
  modelValue: InputValue;
  options?: InputOption[];
}>();

defineEmits<(event: 'update:modelValue', value: InputValue) => void>();
</script>

<template>
  <ul class="space-y-2">
    <li v-for="option in options" :key="option.value">
      <UiRadio
        :checked="option.value === modelValue"
        name="test"
        :value="option.value"
        @click="$emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </UiRadio>
    </li>
  </ul>
</template>
