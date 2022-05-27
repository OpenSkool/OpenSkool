<script lang="ts" setup>
import CompetencyEditPage from '~/domain/competency-management/components/competency-edit-page.vue';
import AuthAccessDenied from '~/domain/global/components/auth/auth-access-denied.vue';

defineProps<{
  competencyId: string;
  frameworkId: string;
}>();

const ability = useAppAbility();
</script>

<template>
  <CompetencyEditPage
    v-if="ability.can('update', 'Competency')"
    :competency-id="competencyId"
    :framework-id="frameworkId"
  />
  <AuthAccessDenied v-else />
</template>
