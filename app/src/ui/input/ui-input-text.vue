<script lang="ts" setup>
withDefaults(
  defineProps<{
    disabled?: boolean;
    is?: 'input' | 'textarea';
    modelValue?: string;
  }>(),
  { is: 'input', modelValue: undefined },
);

defineEmits<(event: 'update:modelValue', value: string) => void>();
</script>

<template>
  <Component
    :is="is"
    class="bg-white rounded-md border-1 border-gray-200 shadow-md py-2 px-3 root inline-block focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary-700) "
    type="text"
    :disabled="disabled"
    :value="modelValue"
    @input="
      $emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
  />
</template>

<style scoped>
.root:disabled {
  @apply cursor-not-allowed bg-stone-300 border-stone-400 border-opacity-50 text-stone-400;
}
</style>
