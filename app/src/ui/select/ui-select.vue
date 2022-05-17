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
    <div class="relative">
      <ListboxButton
        :disabled="disabled"
        :class="[
          'toggle-button',
          'flex items-center justify-between px-3 py-2',
          'bg-white rounded-md shadow-md border-1 border-gray-200',
          'focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-secondary-400)',
          'cursor-default select-none',
        ]"
        v-bind="$attrs"
      >
        <div class="text-base truncate">{{ selectedLabel ?? '–' }}</div>
        <RiArrowDropDownLine aria-hidden class="ml-2" />
      </ListboxButton>
      <Transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          v-slot="{ open }"
          class="absolute py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 focus:outline-none z-10"
          ring="1 black opacity-5"
          text="base"
        >
          <slot v-bind="{ open }" />
        </ListboxOptions>
      </Transition>
    </div>
  </Listbox>
</template>

<style scoped>
.toggle-button:disabled {
  @apply cursor-not-allowed bg-stone-300 border-stone-400 border-opacity-50 text-stone-400;
}
</style>
