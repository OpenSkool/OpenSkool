<script lang="ts" setup>
import { useGlobalQueryLoading } from '@vue/apollo-composable';

const loading = useGlobalQueryLoading();
</script>

<template>
  <TransitionRoot
    :show="loading"
    enter="duration-100 ease-out"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="delay-300 duration-100 ease-in"
    leave-from="opacity-100"
    leave-to="opacity-0"
  >
    <RiLoaderLine class="text-xl text-tertiary-300 spin" />
  </TransitionRoot>
</template>
