<script lang="ts" setup>
import FrameworkListPage from '~/domain/competency-management/components/framework-list-page.vue';
import AuthAccessDenied from '~/domain/global/components/auth/auth-access-denied.vue';

const ability = useAppAbility();
</script>

<template>
  <FrameworkListPage v-if="ability.can('read', 'CompetencyFramework')" />
  <AuthAccessDenied v-else />
</template>
