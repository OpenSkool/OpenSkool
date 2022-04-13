<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
</script>

<template>
  <p>{{ t('global.message') }}</p>
  <a class="btn btn-primary mt-5" :href="`${apiBaseUrl}/openid/connect`">
    Login
  </a>
</template>
