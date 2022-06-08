<script lang="ts" setup>
import { ManageRootCompetenciesDocument } from '~/codegen/graphql';

import CompetencyList from './competency-list.vue';

const props = defineProps<{
  frameworkId: string;
  showReorderControls?: boolean;
}>();

const ability = useAppAbility();

gql`
  query manageRootCompetencies($id: ID!) {
    competencyFramework(id: $id) {
      ... on QueryCompetencyFrameworkSuccess {
        data {
          competencies {
            id
            title
          }
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { result, error, loading } = useQuery(
  ManageRootCompetenciesDocument,
  () => ({ id: props.frameworkId }),
  { fetchPolicy: 'network-only' },
);

const framework = computed(() =>
  result.value?.competencyFramework?.__typename ===
  'QueryCompetencyFrameworkSuccess'
    ? result.value.competencyFramework.data
    : null,
);
</script>

<template>
  <p v-if="error">Something went wrong</p>
  <div v-else-if="loading">Loading</div>
  <p v-else-if="framework == null">Not found</p>
  <template v-else>
    <CompetencyList
      v-if="framework.competencies.length > 0"
      :competencies="framework.competencies"
      :framework-id="frameworkId"
      :refetch-queries="['getFrameworkRootCompetencies']"
      :show-reorder-controls="showReorderControls"
    />
    <UiEmptyCard v-else>
      <p v-t="'frameworks.route.id.index.notFound'" />
      <UiButtonRouterLink
        v-if="ability.can('create', 'Competency')"
        v-t="'frameworks.route.id.index.action.new'"
        class="my-5"
        :to="`${$route.path}/create-competency`"
      />
    </UiEmptyCard>
  </template>
</template>
