<script setup lang="ts">
import { DefaultApolloClient } from '@vue/apollo-composable';

import { apolloClient } from './api';

provide(DefaultApolloClient, apolloClient);
</script>

<template>
  <div class="container mx-auto px-5">
    <h1 class="text-4xl my-5 text-orange-700">OpenSkool</h1>
    <nav class="my-5">
      <ol class="flex gap-5">
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/demo/data-fetching">Data-fetching</router-link>
        </li>
        <li>
          <router-link to="/demo/design/components">Components</router-link>
        </li>
      </ol>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
:global(html, body) {
  @apply antialiased font-sans bg-blue-gray-100;
}

:global(a) {
  @apply text-orange-900;
}
</style>
