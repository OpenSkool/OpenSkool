<script lang="ts" setup>
import { GetAllRootCompetenciesQuery } from '~/generated/graphql';

const { result } = useQuery<GetAllRootCompetenciesQuery>(gql`
  query GetAllRootCompetencies {
    allRootCompetencies {
      id
      title
    }
  }
`);
</script>

<template>
  <h2 class="text-xl mb-3">Manage competencies</h2>
  <ol class="list-decimal">
    <li v-for="competency of result?.allRootCompetencies" :key="competency.id">
      {{ competency?.title }}
    </li>
  </ol>
</template>
