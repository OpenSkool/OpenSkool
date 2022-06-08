<script lang="ts" setup>
import { RootCompetenciesPage } from '~/domain/competency-management';
import { AuthAccessDenied } from '~/domain/global';

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
