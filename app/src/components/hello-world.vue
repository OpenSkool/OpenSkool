<script lang="ts" setup>
import Home4Line from '~icons/ri/home-4-line';

defineProps<{ msg: string }>();

const { result } = useQuery(gql`
  query getEducations {
    educations {
      id
      name
    }
  }
`);

const educations = useResult(result, null, (data) => data.educations);
</script>

<template>
  <div class="flex items-center justify-center gap-2 m-16">
    <home-4-line class="text-pink-500" />
    <h1>{{ msg }}</h1>
  </div>
  <ul class="my-3">
    <li v-for="education of educations" :key="education.id">
      {{ education.name }}
    </li>
  </ul>
</template>
