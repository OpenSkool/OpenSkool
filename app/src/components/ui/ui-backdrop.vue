<script lang="ts" setup>
defineProps<{
  isOpen?: boolean;
}>();
</script>

<template>
  <div
    class="ui-backdrop inset-0"
    :class="{ fixed: isOpen, hidden: !isOpen }"
  ></div>
</template>

<style scoped>
.ui-backdrop {
  background: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.2) 1px,
    rgba(0, 0, 0, 0.3) 1px,
    rgba(0, 0, 0, 0.3) 20px
  );
  filter: blur(2px);
}
</style>
