<script lang="ts" setup>
import { useAuthStore } from '~/auth';
import { useI18nStore } from '~/i18n';

const authStore = useAuthStore();

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/frameworks.*.yaml'));

const { t } = useI18n();
</script>

<template>
  <template v-if="authStore.isLoggedIn">
    <ui-backbutton to="/manage/frameworks">
      {{ t('frameworks.route.create.action.backButton') }}
    </ui-backbutton>
    <ui-title class="text-xl mb-3">
      {{ t('frameworks.route.create.heading') }}
    </ui-title>
    <create-competency-framework />
  </template>
  <template v-else>
    <auth-access-denied />
  </template>
</template>
