<script lang="ts" setup>
import type { AnyComponent } from '~/types';
import UiButton from '~/ui/button/ui-button.vue';

defineProps<{
  is?: string | AnyComponent;
}>();
</script>

<template>
  <MenuButton as="template">
    <Component :is="is ?? UiButton">
      <slot />
    </Component>
  </MenuButton>
</template>
