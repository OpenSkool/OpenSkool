<script lang="ts" setup>
import { DefaultApolloClient } from '@vue/apollo-composable';

import { apolloClient } from '~/apollo';
import { RootLayout } from '~/domain/global';
import { useInitFormkit } from '~/formkit';
import { useHead } from '~/i18n';

useHead(({ t }) => ({
  title: t('global.meta.title'),
}));
useInitFormkit();

provide(DefaultApolloClient, apolloClient);

const { locale } = useI18n();
</script>

<template>
  <Suspense>
    <RootLayout :key="locale">
      <RouterView />
    </RootLayout>
  </Suspense>
</template>

<style>
body {
  @apply font-sans antialiased;
}
</style>
