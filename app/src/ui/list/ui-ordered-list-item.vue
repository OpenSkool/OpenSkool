<script lang="ts" setup>
defineProps<{
  moveUpText?: string;
  moveDownText?: string;
  showArrows?: boolean;
}>();

defineEmits<(event: 'moveUp' | 'moveDown') => void>();
</script>

<template>
  <li
    :class="[
      'bg-white p-5 pl-12 list-inside relative text-sm',
      'first-of-type:rounded-t-lg last-of-type:rounded-b-lg',
    ]"
  >
    <div v-if="showArrows" class="absolute left-0 top-0 h-full">
      <button class="arrow-up top-0 rounded-br-lg" @click="$emit('moveUp')">
        <span v-if="moveUpText" class="sr-only">{{ moveUpText }}</span>
        <RiArrowUpLine aria-hidden />
      </button>
      <button
        class="arrow-down bottom-0 rounded-tr-lg"
        @click="$emit('moveDown')"
      >
        <span v-if="moveDownText" class="sr-only">{{ moveDownText }}</span>
        <RiArrowDownLine aria-hidden />
      </button>
    </div>
    <slot />
  </li>
</template>

<style scoped>
button {
  @apply absolute p-1 pb-0 bg-gray-100/40;
}

li {
  counter-increment: item;
}

li:before {
  content: counter(item);
  margin-right: 10px;
  font-weight: bold;
}

li:first-of-type button.arrow-up {
  display: none;
}
li:last-of-type button.arrow-down {
  display: none;
}
</style>
