<script lang="ts" setup>
defineProps<{
  open?: boolean;
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
          <DialogOverlay class="fixed inset-0 bg-black opacity-30" />
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
            <DialogTitle v-if="$slots.title">
              <slot name="title" />
            </DialogTitle>

            <DialogDescription v-if="$slots.description">
              <slot name="description" />
            </DialogDescription>

            <slot></slot>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
