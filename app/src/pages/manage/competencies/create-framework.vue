<script lang="ts" setup>
import { CompetencyFrameworkCreate } from '~/domain/competency-management';
import { AuthAccessDeniedLayout } from '~/domain/global';

const ability = useAppAbility();
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem link-to="/manage/competencies">
      {{ $t('management.competencyFramework.list.heading') }}
    </UiBreadcrumbItem>
  </UiBreadcrumb>
  <AuthAccessDeniedLayout
    v-if="ability.cannot('create', 'CompetencyFramework')"
  />
  <template v-else>
    <UiTitle is="h1" class="text-xl mb-3">
      {{ $t('management.competencyFramework.create.heading') }}
    </UiTitle>
    <CompetencyFrameworkCreate />
  </template>
</template>
