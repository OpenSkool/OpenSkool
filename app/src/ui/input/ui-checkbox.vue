<script lang="ts" setup>
defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
  <label
    class="flex items-center gap-2"
    :class="{ 'text-stone-300': disabled }"
  >
    <div class="relative w-5 h-5" :class="{ 'cursor-not-allowed': disabled }">
      <input
        :class="[
          'center w-5 h-5 pointer-events-none',
          'bg-white rounded-sm checked:bg-secondary-300',
          'focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-secondary-400)',
          'disabled:bg-stone-300',
        ]"
        :disabled="disabled"
        type="checkbox"
        v-bind="$attrs"
      />
      <RiCheckLine class="center check hidden text-white" />
    </div>
    <slot />
  </label>
</template>

<style scoped>
input:checked + .check {
  display: block;
}
.center {
  @apply absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2;
}
</style>
