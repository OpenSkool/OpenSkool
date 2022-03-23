<script lang="ts" setup>
defineProps<{
  disabled?: boolean;
  modelValue?: number | object | string;
  selectedLabel?: string;
}>();

defineEmits<
  (event: 'update:modelValue', value: number | object | string) => void
>();
</script>

<template>
  <Listbox
    :disabled="disabled"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="relative min-w-50">
      <ListboxButton
        :disabled="disabled"
        class="listbox-button relative w-full px-3 py-2 flex items-center justify-between rounded-lg shadow-md cursor-default"
      >
        <div class="truncate">{{ selectedLabel ?? '–' }}</div>
        <ri-arrow-drop-down-line aria-hidden="true" />
      </ListboxButton>
      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          v-slot="{ open }"
          class="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10"
        >
          <slot v-bind="{ open }"></slot>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<style scoped>
.listbox-button {
  @apply bg-white;
  @apply focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-amber-500);
}
</style>
