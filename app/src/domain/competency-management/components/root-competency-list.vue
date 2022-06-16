<script lang="ts" setup>
import { ManageRootCompetenciesDocument } from '~/codegen/graphql';
import { NotFoundCard, useGlobalStore } from '~/domain/global';

import CompetencyList from './competency-list.vue';

const props = defineProps<{
  frameworkId: string;
  showReorderControls?: boolean;
}>();

const ability = useAppAbility();
const globalStore = useGlobalStore();

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

const { loading, onError, result } = useQuery(
  ManageRootCompetenciesDocument,
  () => ({ id: props.frameworkId }),
  { fetchPolicy: 'network-only' },
);
onError(globalStore.handleFatalApolloError);

const framework = computed(() =>
  result.value?.competencyFramework?.__typename ===
  'QueryCompetencyFrameworkSuccess'
    ? result.value.competencyFramework.data
    : null,
);
</script>

<template>
  <template v-if="!loading">
    <NotFoundCard v-if="framework == null">
      {{ $t('competencies.component.rootCompetencyList.error.notFound') }}
    </NotFoundCard>
    <UiEmptyCard v-else-if="framework.competencies.length === 0">
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
      :competencies="framework.competencies"
      :framework-id="frameworkId"
      :refetch-queries="['getFrameworkRootCompetencies']"
      :show-reorder-controls="showReorderControls"
    />
  </template>
</template>