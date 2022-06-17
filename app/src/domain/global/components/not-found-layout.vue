<script lang="ts" setup>
import NotFoundCard from './not-found-card.vue';
</script>

<template>
  <UiTitle is="h1" class="text-xl mb-3">
    {{ $t('global.layout.notFound.heading') }}
  </UiTitle>
  <NotFoundCard>
    <slot />
  </NotFoundCard>
</template>
