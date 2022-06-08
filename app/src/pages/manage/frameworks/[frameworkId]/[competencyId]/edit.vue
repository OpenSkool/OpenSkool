<script lang="ts" setup>
import { CompetencyEditPage } from '~/domain/competency-management';
import { AuthAccessDenied } from '~/domain/global';

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
