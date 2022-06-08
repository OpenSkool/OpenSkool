<script lang="ts" setup>
import { FrameworkListPage } from '~/domain/competency-management';
import { AuthAccessDenied } from '~/domain/global';

const ability = useAppAbility();
</script>

<template>
  <FrameworkListPage v-if="ability.can('read', 'CompetencyFramework')" />
  <AuthAccessDenied v-else />
</template>
