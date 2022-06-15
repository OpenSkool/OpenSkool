<script lang="ts" setup>
withDefaults(
  defineProps<{
    color?: 'primary' | 'caution' | 'danger' | 'info' | 'success';
    heading?: string;
    headingIs?: string;
  }>(),
  {
    color: undefined,
    heading: undefined,
    headingIs: 'h2',
  },
);
</script>

<template>
  <div
    class="ui-alert"
    :class="{
      'ui-alert--default': color == null,
      'ui-alert--primary': color === 'primary',
      'ui-alert--caution': color === 'caution',
      'ui-alert--danger': color === 'danger',
      'ui-alert--info': color === 'info',
      'ui-alert--success': color === 'success',
    }"
  >
    <Component :is="headingIs" v-if="heading" class="ui-alert__heading">
      {{ heading }}
    </Component>
    <slot />
  </div>
</template>

<style>
.ui-alert {
  @apply rounded-md space-y-5 border-1 text-base py-3 px-5;

  & > a {
    @apply underline;
  }
}
.ui-alert--default {
  @apply bg-light-500 border-dark-800 text-dark-900;
}
.ui-alert--primary {
  @apply bg-primary-100 border-primary-500 text-primary-700;
}
.ui-alert--caution {
  @apply bg-caution-100 border-caution-500 text-caution-700;
}
.ui-alert--danger {
  @apply bg-danger-100 border-danger-500 text-danger-700;
}
.ui-alert--info {
  @apply bg-info-100 border-info-500 text-info-700;
}
.ui-alert--success {
  @apply bg-success-100 border-success-500 text-success-700;
}

.ui-alert__heading {
  @apply font-semibold text-lg;
}
</style>
