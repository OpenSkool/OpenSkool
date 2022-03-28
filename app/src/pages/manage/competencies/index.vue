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
  null,
  { fetchPolicy: 'cache-and-network' },
);

const competencies = useResult(result);
</script>

<template>
  <ui-breadcrumb class="mb-5">
    <li>Manage</li>
    <li>Competencies</li>
  </ui-breadcrumb>
  <h2 class="text-xl mb-3">Manage competencies</h2>
  <router-link class="btn btn-primary my-5" to="/manage/competencies/create">
    Create competency
  </router-link>
  <ol class="list-decimal">
    <li v-for="competency of competencies" :key="competency.id">
      {{ competency?.title }}
      <router-link
        class="inline-block"
        :to="`/manage/competencies/${competency.id}/edit`"
      >
        <span class="sr-only">Edit</span>
        <ri-edit-box-fill aria-hidden />
      </router-link>
    </li>
  </ol>
</template>
