<script lang="ts" setup>
import { useGlobalQueryLoading } from '@vue/apollo-composable';

const loading = useGlobalQueryLoading();
</script>

<template>
  <Transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition delay-150 duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <RiLoaderLine
      v-if="loading"
      aria-hidden
      class="text-lg text-primary-500 animate-spin"
    />
  </Transition>
</template>
