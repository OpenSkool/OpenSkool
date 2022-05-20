<script lang="ts" setup>
const ability = useAppAbility();

defineProps<{
  competencyId: string;
  frameworkId: string;
}>();
</script>

<template>
  <CompetencyCreatePage
    v-if="ability.can('create', 'Competency')"
    :competency-id="competencyId"
    :framework-id="frameworkId"
  />
  <AuthAccessDenied v-else />
</template>
