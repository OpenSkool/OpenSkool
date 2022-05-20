<script lang="ts" setup>
const ability = useAppAbility();
</script>

<template>
  <template v-if="ability.can('read', 'CompetencyFramework')">
    <FrameworkListPage />
  </template>
  <template v-else>
    <AuthAccessDenied />
  </template>
</template>
