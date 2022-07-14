<script lang="ts" setup>
import { i18nLoaderService, LoaderMap } from '~/i18n';

await i18nLoaderService.loadGlob(
  import.meta.glob(
    '~/domain/competency-management/locales/*.yaml',
  ) as LoaderMap,
);
</script>

<template>
  <RouterView />
</template>
