<script lang="ts" setup>
import { useInitFormkit } from '~/formkit';
import { useInitI18n } from '~/i18n';
import appLayout from '~/layout.vue';

useInitFormkit();
useInitI18n();
</script>

<template>
  <app-layout>
    <suspense>
      <router-view />
    </suspense>
  </app-layout>
</template>
