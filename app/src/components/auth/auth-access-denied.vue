<script lang="ts" setup>
import { authConnectUrl } from '~/auth';

const route = useRoute();
const connectHref = computed(() => {
  const connectUrl = new URL(authConnectUrl);
  connectUrl.searchParams.set('from', route.path);
  return connectUrl.toString();
});
</script>

<template>
  <p v-t="'global.auth.unauthorized'" />
  <UiButtonLink v-t="'global.auth.action.login'" :href="connectHref" />
</template>
