<script lang="ts" setup>
import { GetSubCompetenciesQuery } from '~/generated/graphql';

const props = defineProps<{
  id: string; // route param
}>();

const { error, loading, result } = useQuery<GetSubCompetenciesQuery>(
  gql`
    query getSubCompetencies($id: ID!) {
      competency(id: $id) {
        id
        title
        ... on NestedCompetency {
          parentId
        }
        subCompetencies {
          id
          title
        }
      }
    }
  `,
  () => ({ id: props.id }),
  { fetchPolicy: 'network-only' },
);
const competency = useResult(result);
</script>

<template>
  <template v-if="error">
    <p>Something went wrong</p>
  </template>
  <template v-else-if="loading">
    <div>Loading</div>
  </template>
  <template v-if="competency == null">
    <div>Not Found</div>
  </template>
  <template v-else>
    <ui-backbutton
      v-if="competency?.parentId"
      :to="`/manage/competencies/${competency?.parentId}`"
    >
      Back
      <!-- TODO: replace "Back" with title of parent when available in API -->
    </ui-backbutton>
    <ui-backbutton v-else to="/manage/competencies">Competencies</ui-backbutton>
    <h2 class="text-xl mb-3">{{ competency?.title }}</h2>
    <router-link
      class="btn btn-primary my-5"
      :to="`/manage/competencies/${competency.id}/create`"
    >
      New
    </router-link>
    <ol class="list-decimal">
      <li
        v-for="subcompetency of competency.subCompetencies"
        :key="subcompetency.id"
      >
        <router-link :to="`/manage/competencies/${subcompetency.id}`">
          {{ subcompetency.title }}
        </router-link>
        <router-link
          class="inline-block"
          :to="`/manage/competencies/${subcompetency.id}/edit`"
        >
          <span class="sr-only">Edit</span>
          <ri-edit-box-fill aria-hidden />
        </router-link>
      </li>
    </ol>
  </template>
</template>
