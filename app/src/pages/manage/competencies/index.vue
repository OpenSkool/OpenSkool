<script lang="ts" setup>
import { CompetencyFrameworkList } from '~/domain/competency-management';
import { AuthAccessDeniedLayout } from '~/domain/global';
import { ManagementLayout, ManagementLayoutLink } from '~/domain/management';
import { useHead } from '~/i18n';

import RiAddLine from '~icons/ri/add-line';

useHead(({ t }) => ({
  title: t('management.competencyFramework.list.heading'),
}));

const ability = useAppAbility();
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
    <ManagementLayout>
      <template #actions>
        <ManagementLayoutLink
          v-if="ability.can('create', 'CompetencyFramework')"
          :icon="RiAddLine"
          to="/manage/competencies/create-framework"
        >
          {{ $t('management.competencyFramework.action.create') }}
        </ManagementLayoutLink>
      </template>
      <CompetencyFrameworkList />
    </ManagementLayout>
  </template>
</template>
