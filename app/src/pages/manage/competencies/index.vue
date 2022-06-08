<script lang="ts" setup>
import { CompetencyFrameworkList } from '~/domain/competency-management';
import { AuthAccessDeniedLayout, ManagementLayout } from '~/domain/global';
import { ActionItem } from '~/types';

const { t } = useI18n();
const ability = useAppAbility();

const actions: ActionItem[] = [
  {
    action: '/manage/competencies/create-framework',
    icon: 'ri-add-line',
    hasPermission: ability.can('create', 'CompetencyFramework'),
    title: t('frameworks.route.index.action.create'),
  },
];
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem v-t="'global.mainMenu.managementHeader'" />
  </UiBreadcrumb>
  <UiTitle is="h1" class="text-xl mb-3">
    {{ $t('frameworks.route.index.heading') }}
  </UiTitle>
  <AuthAccessDeniedLayout
    v-if="ability.cannot('read', 'CompetencyFramework')"
  />
  <ManagementLayout
    :actions="actions"
    :actions-label="$t('frameworks.route.id.index.actionLabel')"
  >
    <CompetencyFrameworkList />
  </ManagementLayout>
</template>
