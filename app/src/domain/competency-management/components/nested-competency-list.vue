<script lang="ts" setup>
import { ManageNestedCompetenciesDocument } from '~/codegen/graphql';
import { NotFoundCard, useGlobalStore } from '~/domain/global';

import CompetencyList from './competency-list.vue';

const props = defineProps<{
  competencyId: string;
  frameworkId: string;
  showReorderControls?: boolean;
}>();

const ability = useAppAbility();
const globalStore = useGlobalStore();

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

const { loading, onError, result } = useQuery(
  ManageNestedCompetenciesDocument,
  () => ({ id: props.competencyId }),
  { fetchPolicy: 'network-only' },
);
onError(globalStore.handleFatalApolloError);

const competency = computed(() =>
  result.value?.competency?.__typename === 'QueryCompetencySuccess'
    ? result.value.competency.data
    : null,
);
const subCompetencies = computed(() => competency.value?.subCompetencies ?? []);
</script>

<template>
  <template v-if="!loading">
    <NotFoundCard v-if="competency == null">
      {{ $t('competencies.component.nestedCompetencyList.error.notFound') }}
    </NotFoundCard>
    <UiEmptyCard v-else-if="subCompetencies.length === 0">
      <p>{{ $t('frameworks.route.id.index.notFound') }}</p>
      <UiButtonRouterLink
        v-if="ability.can('create', 'Competency')"
        class="my-5"
        :to="`${$route.path}/create-competency`"
      >
        {{ $t('frameworks.route.id.index.action.new') }}
      </UiButtonRouterLink>
    </UiEmptyCard>
    <CompetencyList
      v-else
      :competencies="subCompetencies"
      :framework-id="frameworkId"
      :refetch-queries="['getFrameworkRootCompetencies']"
      :show-reorder-controls="showReorderControls"
    />
  </template>
</template>
