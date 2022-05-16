<script lang="ts" setup>
import UiButton from '~/components/button/ui-button.vue';
import type { AnyComponent } from '~/types';

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
