<script lang="ts" setup>
import RootCompetenciesPage from '~/domain/competency-management/components/root-competencies-page.vue';
import AuthAccessDenied from '~/domain/global/components/auth/auth-access-denied.vue';

defineProps<{
  frameworkId: string;
}>();

const ability = useAppAbility();
</script>

<template>
  <RootCompetenciesPage
    v-if="ability.can('read', 'Competency')"
    :framework-id="frameworkId"
  />
  <AuthAccessDenied v-else />
</template>
