<script lang="ts" setup>
defineProps<{
  moveUpText?: string;
  moveDownText?: string;
  showArrows?: boolean;
}>();

defineEmits<(event: 'moveUp' | 'moveDown') => void>();
</script>

<template>
  <li>
    <slot />
    <span v-if="showArrows">
      <button class="arrow-up" @click="$emit('moveUp')">
        <span v-if="moveUpText" class="sr-only">{{ moveUpText }}</span>
        <RiArrowUpFill aria-hidden />
      </button>
      <button class="arrow-down" @click="$emit('moveDown')">
        <span v-if="moveDownText" class="sr-only">{{ moveDownText }}</span>
        <RiArrowDownFill aria-hidden />
      </button>
    </span>
  </li>
</template>

<style scoped>
li:first-of-type button.arrow-up {
  display: none;
}
li:last-of-type button.arrow-down {
  display: none;
}
</style>
