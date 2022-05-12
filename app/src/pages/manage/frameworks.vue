<script lang="ts" setup>
import { useI18nStore } from '~/i18n';

const i18nStore = useI18nStore();
await i18nStore.loadGlob(import.meta.glob('~/locales/competencies.*.yaml'));
await i18nStore.loadGlob(import.meta.glob('~/locales/frameworks.*.yaml'));
</script>

<template>
  <RouterView />
</template>
