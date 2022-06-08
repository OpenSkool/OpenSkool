<script lang="ts" setup>
import { authConnectUrl } from '~/auth';

const route = useRoute();
const connectHref = computed(() => {
  const connectUrl = new URL(authConnectUrl);
  connectUrl.searchParams.set('from', route.path);
  connectUrl.searchParams.set('baseUrl', window.location.origin);
  return connectUrl.toString();
});
</script>

<template>
  <UiButtonLink v-t="'global.auth.action.login'" :href="connectHref" />
</template>
