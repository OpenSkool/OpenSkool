<script lang="ts" setup>
defineProps<{
  disabled?: boolean;
  modelValue?: string;
}>();

defineEmits<(event: 'update:modelValue', value: string) => void>();
</script>

<template>
  <input
    class="bg-white rounded-md border-1 border-gray-200 shadow-md py-2 px-3 inline-block focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary-700) "
    type="text"
    :disabled="disabled"
    :value="modelValue"
    @input="
      $emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
  />
</template>

<style scoped>
input:disabled {
  @apply cursor-not-allowed bg-stone-300 border-stone-400 border-opacity-50 text-stone-400;
}
</style>
