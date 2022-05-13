<script lang="ts" setup>
import type { FormKitFrameworkContext } from '@formkit/core';

defineProps<{
  context: FormKitFrameworkContext;
}>();
</script>

<template>
  <UiInputText
    :model-value="context._value"
    @update:model-value="context.node.input"
  />
</template>
