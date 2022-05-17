<template>
  <nav class="my-5 mr-5 ml-2 min-w-max min-h-full border-3 border-gray-300">
    <UiTitle
      v-t="'global.title'"
      class="flex justify-center mb-5 text-xl border-b-3 border-gray-300"
    />
    <ol class="space-y-1">
      <slot />
    </ol>
  </nav>
</template>
