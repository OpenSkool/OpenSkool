<script lang="ts" setup>
import { GetEducationsDocument } from '~/generated/graphql';

gql`
  query getEducations {
    allEducations {
      id
      title
    }
  }
`;

const { result } = useQuery(GetEducationsDocument);

const educations = useResult(result, null, (data) => data.allEducations);
</script>

<template>
  <ul class="my-3">
    <li v-for="education of educations" :key="education.id">
      {{ education.title }}
    </li>
  </ul>
</template>
