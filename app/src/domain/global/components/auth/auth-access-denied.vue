<script lang="ts" setup>
import AuthConnectButton from '~/domain/global/components/auth/auth-connect-button.vue';
</script>

<template>
  <p v-t="'global.auth.unauthorized'" />
  <AuthConnectButton />
</template>
