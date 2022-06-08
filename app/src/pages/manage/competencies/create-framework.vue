<script lang="ts" setup>
import { CompetencyFrameworkCreate } from '~/domain/competency-management';
import { AuthAccessDenied } from '~/domain/global';

const ability = useAppAbility();

const { t } = useI18n();
</script>

<template>
  <template v-if="ability.can('create', 'CompetencyFramework')">
    <UiBreadcrumb>
      <UiBreadcrumbItem link-to="/manage/competencies">
        {{ t('frameworks.route.index.heading') }}
      </UiBreadcrumbItem>
    </UiBreadcrumb>
    <UiTitle is="h1" class="text-xl mb-3">
      {{ t('frameworks.route.create.heading') }}
    </UiTitle>
    <CompetencyFrameworkCreate />
  </template>
  <template v-else>
    <AuthAccessDenied />
  </template>
</template>
