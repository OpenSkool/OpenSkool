<script lang="ts" setup>
import { NotFoundLayout } from '~/domain/global';
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem>Error</UiBreadcrumbItem>
  </UiBreadcrumb>
  <NotFoundLayout>
    <p>
      Route
      <code class="bg-light-900 py-1 px-2 inline">{{ $route.fullPath }}</code>
      does not exist.
    </p>
  </NotFoundLayout>
</template>
