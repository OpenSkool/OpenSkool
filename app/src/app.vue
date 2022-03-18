<script setup lang="ts">
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client/core';
import { DefaultApolloClient } from '@vue/apollo-composable';

import { useApolloNetworkStatus } from './hooks';

const { status, statusLink } = useApolloNetworkStatus();
const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_BASE_URL}/graphql`,
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  cache,
  link: statusLink.concat(httpLink),
});

provide(DefaultApolloClient, apolloClient);
</script>

<template>
  <div class="container mx-auto px-5">
    <div class="relative">
      <div class="absolute -ml-10 mt-1">
        <TransitionRoot
          :show="status.isPending"
          enter="duration-100 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="delay-300 duration-100 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <ri-loader-fill class="text-2xl text-orange-500 spin" />
        </TransitionRoot>
      </div>
      <h1 class="text-4xl my-5 text-orange-700">OpenSkool</h1>
    </div>
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

.spin {
  animation: spin 1.25s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
