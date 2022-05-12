<script lang="ts" setup>
import { useI18nStore } from '~/i18n';

const ability = useAppAbility();

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/frameworks.*.yaml'));

const { t } = useI18n();
</script>

<template>
  <template v-if="ability.can('create', 'CompetencyFramework')">
    <UiBreadcrumb>
      <UiBreadcrumbLink to="/manage/frameworks">
        {{ t('frameworks.route.index.heading') }}
      </UiBreadcrumbLink>
    </UiBreadcrumb>
    <UiTitle class="text-xl mb-3">
      {{ t('frameworks.route.create.heading') }}
    </UiTitle>
    <CompetencyFrameworkCreate />
  </template>
  <template v-else>
    <AuthAccessDenied />
  </template>
</template>
