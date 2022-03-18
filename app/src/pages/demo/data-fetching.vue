<script lang="ts" setup>
import { GetEducationsQuery } from '~/generated/graphql';

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
  <ul class="my-3">
    <li v-for="education of educations" :key="education.id">
      {{ education.title }}
    </li>
  </ul>
</template>
