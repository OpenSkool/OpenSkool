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
    class="relative inline-flex flex-shrink-0 h-38px w-74px border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary-700)"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <span class="sr-only">{{ label }}</span>
    <span
      aria-hidden="true"
      :class="modelValue ? 'translate-x-9' : 'translate-x-0'"
      class="pointer-events-none inline-block h-34px w-34px rounded-full bg-white shadow-lg transform transition ease-in-out duration-200"
    />
  </Switch>
</template>
