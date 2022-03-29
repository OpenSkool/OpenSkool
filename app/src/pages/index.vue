<i18n lang="yaml">
en:
  message: Move along. Nothing to see here.
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

useI18n();
</script>

<template>
  <p v-t="'message'" />
  <p v-t="'globalMessage'" />
</template>
