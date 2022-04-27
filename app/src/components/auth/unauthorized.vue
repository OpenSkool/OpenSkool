<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
</script>
<template>
  <p>
    {{ t('global.auth.unauthorized') }}
  </p>
  <a
    class="btn btn-primary"
    :href="`${apiBaseUrl}/openid/connect?from=${$route.path}`"
  >
    {{ t('global.auth.action.login') }}
  </a>
</template>
