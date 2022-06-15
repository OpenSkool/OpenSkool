<template>
  <UiAlert
    color="caution"
    :heading="$t('global.component.notFoundCard.heading')"
  >
    <slot />
  </UiAlert>
</template>
