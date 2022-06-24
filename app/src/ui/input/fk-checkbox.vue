<script lang="ts" setup>
import type { FormKitFrameworkContext } from '@formkit/core';

defineProps<{
  context: FormKitFrameworkContext;
}>();
</script>

<template>
  <UiCheckboxGroup
    :id="context.id"
    class="my-1"
    :options="context.options"
    :model-value="context._value"
    v-bind="context.attrs"
    @update:model-value="context.node.input"
  />
</template>
