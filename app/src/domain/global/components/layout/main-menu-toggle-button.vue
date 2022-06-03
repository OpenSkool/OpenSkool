<script lang="ts" setup>
defineProps<{
  ariaExpanded: boolean;
}>();
</script>

<template>
  <button
    :aria-expanded="ariaExpanded"
    aria-haspopup="menu"
    :class="`
      flex gap-3 items-center px-3 py-2 rounded-md text-base text-dark-700
      focus:outline-none focus-visible:(ring-2 ring-dark-700)
    `"
  >
    <RiMenuFoldLine v-if="ariaExpanded" aria-hidden />
    <RiMenuLine v-else aria-hidden />
    <span v-t="'global.mainMenu.toggleButton'" />
  </button>
</template>
