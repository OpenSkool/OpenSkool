<script lang="ts" setup>
import type { FormKitFrameworkContext } from '@formkit/core';

const props = defineProps<{
  context: FormKitFrameworkContext;
}>();

const selectedLabel = computed(
  () =>
    props.context.options?.find(
      (option) => option.value === props.context._value,
    )?.label,
);

function handleUpdate(changedValue: unknown): void {
  props.context.node.input(changedValue);
}
</script>

<template>
  <UiListbox
    :model-value="props.context._value"
    :selected-label="selectedLabel"
    @update:model-value="handleUpdate"
  >
    <UiListboxOption
      v-for="option in props.context.options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </UiListboxOption>
  </UiListbox>
</template>
