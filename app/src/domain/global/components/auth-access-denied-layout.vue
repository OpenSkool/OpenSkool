<script lang="ts" setup>
import AuthConnectButton from './auth-connect-button.vue';
</script>

<template>
  <UiTitle is="h1" class="text-xl mb-3">Access denied</UiTitle>
  <UiCard>
    <div class="space-y-8">
      <p v-t="'global.auth.unauthorized'" />
      <AuthConnectButton />
    </div>
  </UiCard>
</template>
