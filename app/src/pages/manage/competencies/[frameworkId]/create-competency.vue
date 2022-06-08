<script lang="ts" setup>
import { RootCompetenciesCreatePage } from '~/domain/competency-management';
import { AuthAccessDenied } from '~/domain/global';

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
