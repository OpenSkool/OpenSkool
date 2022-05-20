<script lang="ts" setup>
defineProps<{
  frameworkId: string;
}>();
const ability = useAppAbility();
</script>
<template>
  <template v-if="ability.can('read', 'Competency')">
    <RootCompetenciesPage :framework-id="frameworkId" />
  </template>
  <template v-else>
    <AuthAccessDenied />
  </template>
</template>
