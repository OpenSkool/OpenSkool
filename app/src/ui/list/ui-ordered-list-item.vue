<script lang="ts" setup>
defineProps<{
  linkTo: string;
  moveUpText?: string;
  moveDownText?: string;
  showArrows?: boolean;
}>();

defineEmits<(event: 'moveUp' | 'moveDown') => void>();
</script>

<template>
  <li>
    <RouterLink
      :to="linkTo"
      :class="[
        'relative flex px-10 py-5 list-inside bg-white text-base',
        'first-of-type:rounded-t-lg last-of-type:rounded-b-lg',
        'select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'hover:bg-gray-300/50',
      ]"
    >
      <div v-if="showArrows" class="absolute left-0 top-0 h-full">
        <button
          class="arrow-up top-0 rounded-lg select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-white"
          @click.prevent="$emit('moveUp')"
        >
          <span v-if="moveUpText" class="sr-only">{{ moveUpText }}</span>
          <RiArrowUpLine aria-hidden />
        </button>
        <button
          class="arrow-down bottom-0 rounded-lg select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-white"
          @click.prevent="$emit('moveDown')"
        >
          <span v-if="moveDownText" class="sr-only">{{ moveDownText }}</span>
          <RiArrowDownLine aria-hidden />
        </button>
      </div>
      <slot />
    </RouterLink>
  </li>
</template>

<style scoped>
button {
  @apply absolute p-1 pb-0 bg-gray-100/40;
}

li {
  counter-increment: item;
}
li a:before {
  content: counter(item);
  @apply font-bold mr-5;
}
li:first-of-type button.arrow-up {
  display: none;
}
li:last-of-type button.arrow-down {
  display: none;
}
</style>
