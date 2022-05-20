<script lang="ts" setup>
const ability = useAppAbility();

defineProps<{
  competencyId: string;
  frameworkId: string;
}>();
</script>

<template>
  <template v-if="ability.can('create', 'Competency')">
    <CompetencyCreatePage
      :competency-id="competencyId"
      :framework-id="frameworkId"
    />
  </template>
  <template v-else>
    <AuthAccessDenied />
  </template>
</template>
