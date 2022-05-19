<script lang="ts" setup>
import type { FormKitFrameworkContext } from '@formkit/core';

defineProps<{
  context: FormKitFrameworkContext;
}>();
</script>

<template>
  <UiRadioGroup
    :id="context.id"
    class="my-1"
    :model-value="context._value"
    :name="context.id"
    :options="context.options"
    @update:model-value="context.node.input"
  />
</template>
