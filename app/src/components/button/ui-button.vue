<template>
  <button type="button">
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  @apply inline-flex px-10 py-2 rounded-lg text-primary1-900 bg-primary1-100 font-medium select-none;
  @apply hover:bg-primary1-200;
  @apply focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary1-500);
}
</style>
