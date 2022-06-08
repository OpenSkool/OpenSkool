<script lang="ts" setup>
import { CompetencyCreatePage } from '~/domain/competency-management';
import { AuthAccessDenied } from '~/domain/global';

defineProps<{
  competencyId: string;
  frameworkId: string;
}>();

const ability = useAppAbility();
</script>

<template>
  <CompetencyCreatePage
    v-if="ability.can('create', 'Competency')"
    :competency-id="competencyId"
    :framework-id="frameworkId"
  />
  <AuthAccessDenied v-else />
</template>
