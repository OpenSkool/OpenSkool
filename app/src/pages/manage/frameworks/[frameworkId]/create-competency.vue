<script lang="ts" setup>
const ability = useAppAbility();
defineProps<{
  frameworkId: string;
}>();
</script>

<template>
  <template v-if="ability.can('create', 'Competency')">
    <RootCompetenciesCreatePage :framework-id="frameworkId" />
  </template>
  <template v-else>
    <AuthAccessDenied />
  </template>
</template>
