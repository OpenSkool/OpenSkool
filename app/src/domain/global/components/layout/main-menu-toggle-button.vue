<script lang="ts" setup>
defineProps<{
  ariaExpanded: boolean;
}>();
</script>

<template>
  <button
    :aria-expanded="ariaExpanded"
    aria-haspopup
    :class="`
      flex gap-3 items-center px-3 py-2 rounded-md text-base
      focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-black)
    `"
  >
    <RiMenuFoldLine v-if="ariaExpanded" />
    <RiMenuLine v-else />
    <span v-t="'global.mainMenu.toggleButton'" />
  </button>
</template>
