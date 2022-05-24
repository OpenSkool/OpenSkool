<script lang="ts" setup>
const ability = useAppAbility();
</script>

<template>
  <UiBreadcrumb>
    <li class="inline text-gray-600 text-sm uppercase">Management</li>
  </UiBreadcrumb>
  <UiTitle
    is="h1"
    v-t="'frameworks.route.index.heading'"
    class="text-xl mb-3"
  />
  <UiButtonRouterLink
    v-if="ability.can('create', 'CompetencyFramework')"
    v-t="'frameworks.route.index.action.create'"
    class="my-5"
    to="/manage/frameworks/create-framework"
  />
  <FrameworkList />
</template>
