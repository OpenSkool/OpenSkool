<script lang="ts" setup>
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
  <h1 class="m-16">{{ msg }}</h1>
  <ul class="my-3">
    <li v-for="education of educations" :key="education.id">
      {{ education.name }}
    </li>
  </ul>
</template>
