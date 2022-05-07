<script lang="ts" setup>
import { authConnectUrl } from '~/auth';

const { t } = useI18n();

const route = useRoute();
const connectHref = computed(() => {
  const connectUrl = new URL(authConnectUrl);
  connectUrl.searchParams.set('from', route.path);
  return connectUrl.toString();
});
</script>

<template>
  <p>
    {{ t('global.auth.unauthorized') }}
  </p>
  <a class="btn btn-primary" :href="connectHref">
    {{ t('global.auth.action.login') }}
  </a>
</template>
