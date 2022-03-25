<script lang="ts" setup>
import type { FormKitFrameworkContext } from '@formkit/core';

const props = defineProps<{
  context: FormKitFrameworkContext;
}>();

const value = computed(() => props.context._value as string | number);

const selectedLabel = computed(
  () =>
    props.context.options?.find((option) => option.value === value.value)
      ?.label,
);

function handleUpdate(changedValue: unknown): void {
  props.context.node.input(changedValue);
}
</script>

<template>
  <ui-listbox
    :model-value="value"
    :selected-label="selectedLabel"
    @update:model-value="handleUpdate"
  >
    <ui-listbox-option
      v-for="option in props.context.options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </ui-listbox-option>
  </ui-listbox>
</template>
