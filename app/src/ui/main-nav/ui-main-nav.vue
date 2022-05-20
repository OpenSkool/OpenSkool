<script lang="ts" setup>
import imgUrl from './backpack.png';
</script>

<template>
  <nav class="min-w-max">
    <header
      class="flex flex-column gap-1 justify-center items-center border-b-1 border-gray-300 mb-5 pb-2"
    >
      <img class="h-8" :src="imgUrl" />
      <UiTitle v-t="'global.title'" class="font-normal text-xl" />
    </header>
    <slot />
  </nav>
</template>
