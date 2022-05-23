<script lang="ts" setup>
const ability = useAppAbility();
</script>

<template>
  <!-- Breadcrumb placeholder -->
  <div class="text-sm">&nbsp;</div>
  <UiTitle
    is="h2"
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
