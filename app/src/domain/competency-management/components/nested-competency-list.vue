<script lang="ts" setup>
import { ManageNestedCompetenciesDocument } from '~/codegen/graphql';
import NotFoundCard from '~/domain/global/components/not-found-card.vue';

import CompetencyList from './competency-list.vue';

const props = defineProps<{
  competencyId: string;
  frameworkId: string;
  showReorderControls?: boolean;
}>();

const ability = useAppAbility();

gql`
  query manageNestedCompetencies($id: ID!) {
    competency(id: $id) {
      ... on QueryCompetencySuccess {
        data {
          subCompetencies {
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
  ManageNestedCompetenciesDocument,
  () => ({ id: props.competencyId }),
  { fetchPolicy: 'network-only' },
);

const subCompetencies = computed(() =>
  result.value?.competency?.__typename === 'QueryCompetencySuccess'
    ? result.value.competency.data.subCompetencies ?? []
    : null,
);
</script>

<template>
  <p v-if="error">Something went wrong</p>
  <div v-else-if="loading">Loading</div>
  <NotFoundCard v-else-if="subCompetencies == null" />
  <template v-else>
    <CompetencyList
      v-if="subCompetencies.length > 0"
      :competencies="subCompetencies"
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
