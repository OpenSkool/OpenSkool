<script lang="ts" setup>
import { ManagementLayout } from '~/domain/global';
import { ActionItem } from '~/types';

import FrameworkList from './framework-list.vue';

const ability = useAppAbility();
const { t } = useI18n();
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
  <UiTitle
    is="h1"
    v-t="'frameworks.route.index.heading'"
    class="text-xl mb-3"
  />
  <ManagementLayout
    :actions="actions"
    :actions-label="t('frameworks.route.id.index.actionLabel')"
  >
    <FrameworkList />
  </ManagementLayout>
</template>
