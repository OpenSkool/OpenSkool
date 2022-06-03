<script lang="ts" setup>
import { DialogOverlay } from '@headlessui/vue';

defineProps<{
  implicitClose?: boolean;
  open: boolean;
}>();

defineEmits<(event: 'close') => void>();
</script>

<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="template" @close="$emit('close')">
      <div class="fixed inset-0">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <Component
            :is="implicitClose ? DialogOverlay : 'div'"
            aria-hidden="true"
            class="fixed inset-0 bg-black opacity-30"
          />
        </TransitionChild>
        <TransitionChild
          enter="duration-300 ease-out transform"
          enter-from="opacity-0 scale-75 translate-y-2em"
          enter-to="opacity-100 scale-100 translate-y-0"
          leave="duration-100 ease-in transform"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-50"
        >
          <div
            class="relative z-10 max-w-lg mx-auto my-8 shadow-xl rounded-2xl p-6 bg-white"
            v-bind="$attrs"
          >
            <div v-if="implicitClose" class="absolute top-0 right-0 p-3">
              <button
                class="flex rounded-lg p-2 text-dark-700 focus:outline-none focus-visible:(ring-2 ring-dark-700)"
                type="button"
                @click="$emit('close')"
              >
                <RiCloseLine />
              </button>
            </div>
            <div class="space-y-8">
              <slot />
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
