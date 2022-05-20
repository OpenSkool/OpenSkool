<script lang="ts" setup>
defineProps<{
  competencyId: string;
  frameworkId: string;
}>();
const ability = useAppAbility();
</script>

<template>
  <template v-if="ability.can('update', 'Competency')">
    <CompetencyEditPage
      :competency-id="competencyId"
      :framework-id="frameworkId"
    />
  </template>
  <template v-else>
    <AuthAccessDenied />
  </template>
</template>
