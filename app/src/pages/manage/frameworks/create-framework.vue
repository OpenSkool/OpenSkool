<script lang="ts" setup>
import CompetencyFrameworkCreate from '~/domain/competency-management/components/competency-framework-create.vue';
import AuthAccessDenied from '~/domain/global/components/auth/auth-access-denied.vue';

const ability = useAppAbility();

const { t } = useI18n();
</script>

<template>
  <template v-if="ability.can('create', 'CompetencyFramework')">
    <UiBreadcrumb>
      <UiBreadcrumbItem link-to="/manage/frameworks">
        {{ t('frameworks.route.index.heading') }}
      </UiBreadcrumbItem>
    </UiBreadcrumb>
    <UiTitle is="h1" class="mb-3 text-xl">
      {{ t('frameworks.route.create.heading') }}
    </UiTitle>
    <CompetencyFrameworkCreate />
  </template>
  <template v-else>
    <AuthAccessDenied />
  </template>
</template>
