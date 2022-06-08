<script lang="ts" setup>
defineProps<{
  linkTo: string;
  moveDownText?: string;
  moveUpText?: string;
  showReorderControls?: boolean;
}>();

defineEmits<(event: 'moveUp' | 'moveDown') => void>();
</script>

<template>
  <li class="flex relative">
    <RouterLink
      :to="linkTo"
      :class="[
        'flex-1 flex px-10 py-5 bg-white text-base',
        'first-of-type:rounded-t-lg last-of-type:rounded-b-lg',
        'select-none focus:outline-none focus-visible:(ring-2 ring-primary-700)',
        'hover:bg-gray-200',
      ]"
    >
      <div v-if="showReorderControls" class="inset-0 absolute">
        <button
          class="rounded-lg top-0 arrow-up select-none hover:bg-white focus:outline-none focus-visible:(ring-2 ring-dark-700)"
          @click.prevent="$emit('moveUp')"
        >
          <span v-if="moveUpText" class="sr-only">{{ moveUpText }}</span>
          <RiArrowUpLine aria-hidden />
        </button>
        <button
          class="rounded-lg bottom-0 arrow-down select-none hover:bg-white focus:outline-none focus-visible:(ring-2 ring-dark-700)"
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
  @apply bg-gray-100/40 p-1 pb-0 absolute;
}
li {
  counter-increment: item;

  & > a::before {
    content: counter(item);
    @apply font-bold mr-5 text-right;
    flex: 0 0 2ch;
    font-variant-numeric: tabular-nums;
  }
}
li:first-of-type button.arrow-up {
  display: none;
}
li:last-of-type button.arrow-down {
  display: none;
}
</style>
