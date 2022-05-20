<script lang="ts" setup>
const ability = useAppAbility();
defineProps<{
  frameworkId: string;
}>();
</script>

<template>
  <RootCompetenciesCreatePage
    v-if="ability.can('create', 'Competency')"
    :framework-id="frameworkId"
  />
  <AuthAccessDenied v-else />
</template>
