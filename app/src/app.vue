<script lang="ts" setup>
import { DefaultApolloClient } from '@vue/apollo-composable';

import { apolloClient } from '~/apollo';
import MainLayout from '~/domain/global/components/layout/main-layout.vue';
import { useInitFormkit } from '~/formkit';

useInitFormkit();

provide(DefaultApolloClient, apolloClient);

const { locale } = useI18n();
</script>

<template>
  <Suspense>
    <MainLayout :key="locale">
      <RouterView />
    </MainLayout>
  </Suspense>
</template>

<style>
body {
  @apply font-sans antialiased;
}
</style>
