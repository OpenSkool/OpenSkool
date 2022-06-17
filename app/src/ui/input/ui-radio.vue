<script lang="ts" setup>
defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
  <label
    class="flex gap-2 items-center"
    :class="{ 'text-stone-300': disabled }"
  >
    <input
      class="bg-white rounded-full h-5 w-5 relative focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary-700) checked:bg-primary-400 disabled:cursor-not-allowed disabled:bg-stone-300 "
      :disabled="disabled"
      type="radio"
      v-bind="$attrs"
    />
    <slot />
  </label>
</template>

<style scoped>
input:checked::before {
  content: '';
  @apply transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute;
  @apply h-2 w-2 block;
  @apply bg-white rounded-full;
}
</style>
