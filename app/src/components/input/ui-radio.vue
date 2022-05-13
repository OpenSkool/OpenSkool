<template>
  <label class="flex items-center gap-2">
    <input
      class="relative appearance-none w-5 h-5 bg-white rounded-full checked:bg-secondary-300"
      type="radio"
      v-bind="$attrs"
    />
    <slot />
  </label>
</template>

<style scoped>
input:checked::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  @apply block w-2 h-2 bg-white rounded-full;
}
</style>
