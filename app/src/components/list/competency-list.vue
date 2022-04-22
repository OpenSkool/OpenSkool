<script lang="ts" setup>
interface Competency {
  id: string;
  title: string;
}

defineProps<{
  competencies: Competency[];
  frameworkId: string;
}>();
</script>
<template>
  <ol class="list-decimal">
    <li v-for="competency of competencies" :key="competency.id">
      <router-link :to="`/manage/frameworks/${frameworkId}/${competency.id}`">
        {{ competency.title }} {{ competency.id }}
      </router-link>
    </li>
  </ol>
</template>
