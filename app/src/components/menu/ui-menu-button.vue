<script lang="ts" setup>
import { createButtonStyles } from '../button/helpers';
</script>

<template>
  <MenuButton :class="createButtonStyles()">
    <slot />
  </MenuButton>
</template>
