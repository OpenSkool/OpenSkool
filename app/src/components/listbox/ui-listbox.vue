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
        class="listbox-button relative w-full flex items-center justify-between rounded-lg shadow-md cursor-default bg-white focus:outline-none"
        p="x-3 y-2"
        focus-visible:ring="2 offset-2 primary1-500"
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
          class="absolute w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 focus:outline-none z-10"
          ring="1 black opacity-5"
          text="base sm:sm"
        >
          <slot v-bind="{ open }"></slot>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
