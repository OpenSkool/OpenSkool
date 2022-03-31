<script lang="ts" setup>
import { DefaultApolloClient } from '@vue/apollo-composable';

import { apolloClient } from '~/apollo';
import { useInitFormkit } from '~/formkit';
import { useInitI18n } from '~/i18n';
import appLayout from '~/layout.vue';

useInitFormkit();
useInitI18n();

provide(DefaultApolloClient, apolloClient);
</script>

<template>
  <app-layout>
    <suspense>
      <router-view />
    </suspense>
  </app-layout>
</template>
