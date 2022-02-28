<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { UseFocusTrap } from '@vueuse/integrations/useFocusTrap/component';

defineProps<{
  isOpen?: boolean;
}>();

const emit = defineEmits<(event: 'dismiss') => void>();

const dialogRef = ref<HTMLElement>();
onClickOutside(dialogRef, () => void emit('dismiss'));
</script>

<template>
  <teleport to="body">
    <UseFocusTrap v-if="isOpen">
      <ui-backdrop :is-open="true" />
      <dialog
        ref="dialogRef"
        class="container mx-auto relative bg-white p-14"
        :open="isOpen"
        v-bind="$attrs"
        @keydown.esc.prevent="$emit('dismiss')"
      >
        <slot name="content">
          <button
            class="absolute top-0 right-0 p-3 transform -translate-y-full focus-visible:outline-solid-gray-500"
            type="button"
            @click.prevent="$emit('dismiss')"
          >
            <ui-visually-hidden>Close</ui-visually-hidden>
            <ri-close-line aria-hidden="true" />
          </button>
          <slot></slot>
        </slot>
      </dialog>
    </UseFocusTrap>
  </teleport>
</template>
