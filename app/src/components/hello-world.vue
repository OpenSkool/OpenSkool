<script lang="ts" setup>
import { GetEducationsQuery } from '~/generated/graphql';

defineProps<{ msg: string }>();

const { result } = useQuery<GetEducationsQuery>(gql`
  query getEducations {
    allEducations {
      id
      title
    }
  }
`);

const educations = useResult(result, null, (data) => data.allEducations);
</script>

<template>
  <div class="flex items-center justify-center gap-2 m-16">
    <ri-home-4-line class="text-pink-500" />
    <h1>{{ msg }}</h1>
  </div>
  <ul class="my-3">
    <li v-for="education of educations" :key="education.id">
      {{ education.title }}
    </li>
  </ul>
</template>
