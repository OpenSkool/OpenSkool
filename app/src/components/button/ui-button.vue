<template>
  <button type="button">
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  @apply inline-flex px-10 py-2 rounded-lg text-amber-900 bg-amber-100 font-medium select-none;
  @apply hover:bg-amber-200;
  @apply focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-amber-500);
}
</style>
