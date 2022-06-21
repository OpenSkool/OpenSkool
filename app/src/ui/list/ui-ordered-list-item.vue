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
      class="bg-white flex flex-1 py-5 px-10 select-none hover:bg-gray-200 focus:outline-none focus-visible:(ring-2 ring-primary-700) first-of-type:rounded-t-lg last-of-type:rounded-b-lg "
    >
      <div v-if="showReorderControls" class="inset-0 absolute">
        <button class="top-0 arrow" @click.prevent="$emit('moveUp')">
          <RiArrowUpLine aria-hidden />
          <span v-if="moveUpText" class="sr-only">{{ moveUpText }}</span>
        </button>
        <button class="bottom-0 arrow" @click.prevent="$emit('moveDown')">
          <RiArrowDownLine aria-hidden />
          <span v-if="moveDownText" class="sr-only">{{ moveDownText }}</span>
        </button>
      </div>
      <slot />
    </RouterLink>
  </li>
</template>

<style scoped>
.arrow {
  @apply rounded-md bg-gray-300 p-1 absolute select-none;
  @apply hover:bg-primary-200 focus:outline-none active:bg-primary-200 focus-visible:(ring-2 ring-dark-700) ;
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
li:first-of-type button:first-of-type,
li:last-of-type button:last-of-type {
  display: none;
}
</style>
