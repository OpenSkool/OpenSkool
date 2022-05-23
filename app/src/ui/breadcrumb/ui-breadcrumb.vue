<script lang="ts" setup>
const { t } = useI18n();
</script>

<template>
  <nav :aria-label="t('global.breadcrumb.label')">
    <ol>
      <slot />
    </ol>
  </nav>
</template>
