<script lang="ts" setup>
import { i18nLoaderService } from '~/i18n';

await i18nLoaderService.loadGlob(
  import.meta.glob('~/locales/competencies.*.yaml'),
);
await i18nLoaderService.loadGlob(
  import.meta.glob('~/locales/frameworks.*.yaml'),
);
</script>

<template>
  <RouterView />
</template>
