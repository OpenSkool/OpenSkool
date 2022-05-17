<script lang="ts" setup>
import { i18nLoaderService } from '~/i18n';

const { locale } = useI18n();

await i18nLoaderService.loadGlobalMessages();
</script>

<template>
  <MainLayout :key="locale">
    <RouterView />
  </MainLayout>
</template>
