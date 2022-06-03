<script lang="ts" setup>
import FrameworkList from '~/domain/competency-management/components/framework-list.vue';

const ability = useAppAbility();
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
  <UiButtonRouterLink
    v-if="ability.can('create', 'CompetencyFramework')"
    v-t="'frameworks.route.index.action.create'"
    class="my-5"
    to="/manage/frameworks/create-framework"
  />
  <FrameworkList />
</template>
