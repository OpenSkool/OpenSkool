<script lang="ts" setup>
import { CompetencyFrameworkCreate } from '~/domain/competency-management';
import { AuthAccessDeniedLayout } from '~/domain/global';

const ability = useAppAbility();
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem link-to="/manage/competencies">
      {{ $t('frameworks.route.index.heading') }}
    </UiBreadcrumbItem>
  </UiBreadcrumb>
  <UiTitle is="h1" class="text-xl mb-3">
    {{ $t('frameworks.route.create.heading') }}
  </UiTitle>
  <AuthAccessDeniedLayout
    v-if="ability.cannot('create', 'CompetencyFramework')"
  />
  <CompetencyFrameworkCreate v-else />
</template>
