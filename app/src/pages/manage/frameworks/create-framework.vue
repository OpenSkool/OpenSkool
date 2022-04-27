<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { useI18nStore } from '~/i18n';

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/frameworks.*.yaml'));

const { t } = useI18n();
</script>

<template>
  <ui-backbutton to="/manage/frameworks">
    {{ t('frameworks.route.create.action.backButton') }}
  </ui-backbutton>
  <h2 class="text-xl mb-3">
    {{ t('frameworks.route.create.heading') }}
  </h2>
  <create-competency-framework></create-competency-framework>
</template>
