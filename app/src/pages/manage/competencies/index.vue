<script lang="ts" setup>
import { GetAllRootCompetenciesQuery } from '~/generated/graphql';

const { result } = useQuery<GetAllRootCompetenciesQuery>(
  gql`
    query GetAllRootCompetencies {
      allRootCompetencies {
        id
        title
      }
    }
  `,
);

const competencies = useResult(result);
</script>

<template>
  <h2 class="text-xl mb-3">Manage competencies</h2>
  <router-link class="btn btn-primary my-5" to="/manage/competencies/create">
    Create competency
  </router-link>
  <ol class="list-decimal">
    <li v-for="competency of competencies" :key="competency.id">
      <router-link :to="`/manage/competencies/${competency.id}`">
        {{ competency.title }}
      </router-link>
    </li>
  </ol>
</template>
