<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const redirectUri = new URL(window.location.href);
</script>
<template>
  <p>
    {{ t('global.auth.unauthorized') }}
  </p>
  <a
    class="btn btn-primary"
    :href="`${apiBaseUrl}/openid/connect?redirect_uri=${redirectUri}`"
  >
    {{ t('global.auth.action.login') }}
  </a>
</template>
