<script lang="ts" setup>
import RootCompetenciesCreatePage from '~/domain/competency-management/components/root-competencies-create-page.vue';
import AuthAccessDenied from '~/domain/global/components/auth/auth-access-denied.vue';

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
