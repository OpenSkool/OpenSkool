<script lang="ts" setup>
import { CompetencyFrameworkList } from '~/domain/competency-management';
import { AuthAccessDeniedLayout, ManagementLayout } from '~/domain/global';
import { useHead } from '~/i18n';
import { ActionItem } from '~/types';

useHead(({ t }) => ({
  title: t('management.competencyFramework.list.heading'),
}));

const { t } = useI18n();
const ability = useAppAbility();

const actions: ActionItem[] = [
  {
    action: '/manage/competencies/create-framework',
    icon: 'ri-add-line',
    hasPermission: ability.can('create', 'CompetencyFramework'),
    title: t('management.competencyFramework.action.create'),
  },
];
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem>
      {{ $t('global.mainMenu.management.heading') }}
    </UiBreadcrumbItem>
  </UiBreadcrumb>
  <AuthAccessDeniedLayout
    v-if="ability.cannot('read', 'CompetencyFramework')"
  />
  <template v-else>
    <UiTitle is="h1" class="text-xl mb-3">
      {{ $t('management.competencyFramework.list.heading') }}
    </UiTitle>
    <ManagementLayout :actions="actions">
      <CompetencyFrameworkList />
    </ManagementLayout>
  </template>
</template>
