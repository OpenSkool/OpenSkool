<script lang="ts" setup>
import { i18nLoaderService } from '~/i18n';

await i18nLoaderService.loadGlob(
  import.meta.glob('~/domain/competency-management/locales/*.yaml'),
);
</script>

<template>
  <RouterView />
</template>
