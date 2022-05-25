<script lang="ts" setup>
defineProps<{
  frameworkId: string;
}>();

const ability = useAppAbility();
</script>

<template>
  <RootCompetenciesCreatePage
    v-if="ability.can('create', 'Competency')"
    :framework-id="frameworkId"
  />
  <AuthAccessDenied v-else />
</template>
