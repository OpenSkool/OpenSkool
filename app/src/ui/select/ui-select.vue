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
    <div class="relative" v-bind="$attrs">
      <ListboxButton
        :disabled="disabled"
        class="bg-white rounded-md cursor-default flex border-1 border-gray-200 shadow-md py-2 px-3 toggle-button items-center justify-between select-none focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary-700) "
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
          class="bg-white rounded-md shadow-lg mt-1 max-h-60 py-1 z-10 absolute overflow-auto focus:outline-none"
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
