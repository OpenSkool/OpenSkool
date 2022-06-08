<script lang="ts" setup>
import FrameworkList from '~/domain/competency-management/components/framework-list.vue';
import ManagementLayout from '~/domain/competency-management/components/layout/management-layout.vue';
import { ActionItem } from '~/types';

const ability = useAppAbility();
const { t } = useI18n();
const actions: ActionItem[] = [
  {
    action: '/manage/frameworks/create-framework',
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
  <UiTitle
    is="h1"
    v-t="'frameworks.route.index.heading'"
    class="mb-3 text-xl"
  />
  <ManagementLayout
    :actions="actions"
    :actions-label="t('frameworks.route.id.index.actionLabel')"
  >
    <FrameworkList />
  </ManagementLayout>
</template>
