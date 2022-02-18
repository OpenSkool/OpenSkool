<script lang="ts" setup>
defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <h1 class="m-16">{{ msg }}</h1>
  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>
  <p>See <code>README.md</code> for more information.</p>
  <p class="my-5">
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Docs
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>
  <button class="my-5" type="button" @click="count += 1">
    count is: {{ count }}
  </button>
  <p>
    Edit <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>
