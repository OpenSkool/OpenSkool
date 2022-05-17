<script lang="ts" setup>
import type { AnyComponent } from '~/types';
import UiButton from '~/ui/button/ui-button.vue';

withDefaults(
  defineProps<{
    is?: string | AnyComponent;
  }>(),
  {
    is: UiButton,
  },
);
</script>

<template>
  <MenuButton>
    <Component :is="is">
      <slot />
    </Component>
  </MenuButton>
</template>
