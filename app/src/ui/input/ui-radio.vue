<template>
  <label class="flex items-center gap-2">
    <input
      :class="[
        'relative w-5 h-5',
        'bg-white rounded-full checked:bg-secondary-300',
        'focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-secondary-400)',
      ]"
      type="radio"
      v-bind="$attrs"
    />
    <slot />
  </label>
</template>

<style scoped>
input:checked::before {
  content: '';
  @apply absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2;
  @apply block w-2 h-2;
  @apply bg-white rounded-full;
}
</style>
