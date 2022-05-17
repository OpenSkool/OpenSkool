<script lang="ts" setup>
import type { InputOption, InputValue } from './types';

const props = defineProps<{
  modelValue: InputValue[];
  options?: InputOption[];
}>();

const emit =
  defineEmits<(event: 'update:modelValue', value: InputValue[]) => void>();

function toggleValue(value: InputValue): void {
  emit(
    'update:modelValue',
    props.modelValue.includes(value)
      ? props.modelValue.filter((v) => value !== v)
      : [...props.modelValue, value],
  );
}
</script>

<template>
  <ul class="flex flex-col gap-2 my-1">
    <li v-for="option in options" :key="option.value">
      <UiCheckbox
        :checked="modelValue.includes(option.value)"
        name="test"
        :value="option.value"
        @click="toggleValue(option.value)"
      >
        {{ option.label }}
      </UiCheckbox>
    </li>
  </ul>
</template>
