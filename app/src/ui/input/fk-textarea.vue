<script lang="ts" setup>
import type { FormKitFrameworkContext } from '@formkit/core';

defineProps<{
  context: FormKitFrameworkContext;
}>();
</script>

<template>
  <UiInputText
    is="textarea"
    :id="context.id"
    :model-value="context._value"
    rows="3"
    v-bind="context.attrs"
    @update:model-value="context.node.input"
  />
</template>
