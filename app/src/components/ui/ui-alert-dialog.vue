<script lang="ts" setup>
import { UseFocusTrap } from '@vueuse/integrations/useFocusTrap/component';

defineProps<{
  id: string;
  isOpen?: boolean;
}>();

defineEmits<(event: 'dismiss') => void>();
</script>

<template>
  <teleport to="body">
    <UseFocusTrap v-if="isOpen">
      <ui-backdrop :is-open="true" />
      <dialog
        :aria-describedby="
          $slots.content == null && $slots.label != null
            ? `${id}-dialog-description`
            : undefined
        "
        :aria-labeledby="
          $slots.content == null && $slots.description != null
            ? `${id}-dialog-label`
            : undefined
        "
        class="container mx-auto relative bg-white p-14"
        open="true"
        role="alertdialog"
        v-bind="$attrs"
        @keydown.esc.prevent="void 0"
      >
        <slot name="content">
          <div
            v-if="$slots.label"
            :id="`${id}-dialog-label`"
            class="mb-5 font-bold text-xl"
          >
            <slot name="label"></slot>
          </div>
          <div v-if="$slots.description" :id="`${id}-dialog-description`">
            <slot name="description"></slot>
          </div>
          <div v-if="$slots.buttons" class="mt-10 flex flex-row-reverse gap-3">
            <slot name="buttons"></slot>
          </div>
        </slot>
      </dialog>
    </UseFocusTrap>
  </teleport>
</template>
