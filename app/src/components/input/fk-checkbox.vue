<script lang="ts" setup>
import type { FormKitFrameworkContext } from '@formkit/core';

defineProps<{
  context: FormKitFrameworkContext;
}>();
</script>

<template>
  <UiCheckboxGroup
    :id="context.id"
    :options="context.options"
    :model-value="context._value"
    @update:model-value="context.node.input"
  />
</template>
