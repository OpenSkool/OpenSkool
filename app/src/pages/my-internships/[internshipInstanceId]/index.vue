<script lang="ts" setup>
defineProps<{
  internshipInstanceId: string; // route param
}>();
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem link-to="/manage/competencies">
      {{ $t('global.mainMenu.internships') }}
    </UiBreadcrumbItem>
  </UiBreadcrumb>
  <UiTitle is="h1" class="text-xl mb-3">My Internship</UiTitle>
</template>
