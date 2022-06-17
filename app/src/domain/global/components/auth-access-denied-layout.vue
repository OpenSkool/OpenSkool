<script lang="ts" setup>
import AuthConnectButton from './auth-connect-button.vue';
</script>

<template>
  <UiTitle is="h1" class="text-xl mb-3">
    {{ $t('global.auth.accessDenied.heading') }}
  </UiTitle>
  <UiCard>
    <div class="space-y-5">
      <p v-t="'global.auth.accessDenied.message'" />
      <AuthConnectButton />
    </div>
  </UiCard>
</template>
