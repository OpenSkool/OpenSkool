<script lang="ts" setup>
import { CompetencyListPage } from '~/domain/competency-management';
import { AuthAccessDenied } from '~/domain/global';

defineProps<{
  competencyId: string;
  frameworkId: string;
}>();

const ability = useAppAbility();
</script>

<template>
  <CompetencyListPage
    v-if="ability.can('read', 'Competency')"
    :competency-id="competencyId"
    :framework-id="frameworkId"
  />
  <AuthAccessDenied v-else />
</template>
