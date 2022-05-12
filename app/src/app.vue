<script lang="ts" setup>
import { DefaultApolloClient } from '@vue/apollo-composable';

import { apolloClient } from '~/apollo';
import { useInitFormkit } from '~/formkit';
import { useInitI18n } from '~/i18n';
import AppLayout from '~/layout.vue';

useInitFormkit();
const i18nStore = useInitI18n();

provide(DefaultApolloClient, apolloClient);
</script>

<template>
  <AppLayout :key="i18nStore.locale">
    <Suspense>
      <RouterView />
    </Suspense>
  </AppLayout>
</template>
