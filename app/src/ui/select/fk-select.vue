<script lang="ts" setup>
import type { FormKitFrameworkContext } from '@formkit/core';

const props = defineProps<{
  context: FormKitFrameworkContext;
}>();

const selectedLabel = computed(() => {
  const placeholder =
    typeof props.context.attrs.placeholder === 'string'
      ? props.context.attrs.placeholder
      : undefined;
  const selectedOption = props.context.options?.find(
    (option) => option.value === props.context._value,
  );
  return selectedOption?.label ?? placeholder;
});

function handleUpdate(changedValue: unknown): void {
  props.context.node.input(changedValue);
}
</script>

<template>
  <UiSelect
    :id="context.id"
    :model-value="props.context._value"
    :selected-label="selectedLabel"
    v-bind="context.attrs"
    @update:model-value="handleUpdate"
  >
    <UiSelectOption
      v-for="option in props.context.options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </UiSelectOption>
  </UiSelect>
</template>
