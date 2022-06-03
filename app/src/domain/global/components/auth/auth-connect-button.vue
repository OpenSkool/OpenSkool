<script lang="ts" setup>
import { authConnectUrl } from '~/auth';

const route = useRoute();
const connectHref = computed(() => {
  const connectUrl = new URL(authConnectUrl);
  connectUrl.searchParams.set('from', window.location.href + route.path);
  return connectUrl.toString();
});
</script>

<template>
  <UiButtonLink v-t="'global.auth.action.login'" :href="connectHref" />
</template>
