<script lang="ts" setup>
const ability = useAppAbility();
</script>

<template>
  <FrameworkListPage v-if="ability.can('read', 'CompetencyFramework')" />
  <AuthAccessDenied v-else />
</template>
