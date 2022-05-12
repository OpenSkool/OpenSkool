<script lang="ts" setup>
import { i18nLoaderService } from '~/i18n';
import AppLayout from '~/layout.vue';

const { locale } = useI18n();

await i18nLoaderService.loadGlobalMessages();
</script>

<template>
  <AppLayout :key="locale">
    <RouterView />
  </AppLayout>
</template>
