<script lang="ts" setup>
defineProps<{
  label: string;
  modelValue?: boolean;
}>();

defineEmits<(event: 'update:modelValue', value: boolean) => void>();
</script>

<template>
  <Switch
    :model-value="modelValue"
    :class="modelValue ? 'bg-primary-400' : 'bg-primary-600'"
    class="border-transparent rounded-full cursor-pointer border-2 flex-shrink-0 h-38px transition-colors ease-in-out w-74px duration-200 relative inline-flex focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary-700) "
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <span class="sr-only">{{ label }}</span>
    <span
      aria-hidden
      :class="modelValue ? 'translate-x-9' : 'translate-x-0'"
      class="bg-white rounded-full h-34px shadow-lg transform transition ease-in-out w-34px duration-200 inline-block pointer-events-none"
    />
  </Switch>
</template>
