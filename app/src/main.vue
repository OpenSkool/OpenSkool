<script lang="ts" setup>
import { DefaultApolloClient } from '@vue/apollo-composable';

import { apolloClient } from '~/apollo';
import { useInitFormkit } from '~/formkit';

import App from './app.vue';

useInitFormkit();

provide(DefaultApolloClient, apolloClient);
</script>

<template>
  <Suspense>
    <App />
  </Suspense>
</template>
