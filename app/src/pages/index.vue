<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { useAuthStore } from '~/auth';

const { t } = useI18n();

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const authStore = useAuthStore();
</script>

<template>
  <p>{{ t('global.message') }}</p>
  <a
    v-if="!authStore.isLoggedIn"
    class="btn btn-primary mt-5"
    :href="`${apiBaseUrl}/openid/connect`"
  >
    Connect
  </a>
  <p v-else>You are logged in.</p>
</template>
