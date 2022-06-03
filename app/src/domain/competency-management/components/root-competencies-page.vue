<script lang="ts" setup>
import { GetFrameworkRootCompetenciesDocument } from '~/codegen/graphql';
import CompetencyList from '~/domain/competency-management/components/competency-list.vue';

const props = defineProps<{
  frameworkId: string;
}>();

const ability = useAppAbility();

gql`
  query getFrameworkRootCompetencies($id: ID!) {
    competencyFramework(id: $id) {
      ... on QueryCompetencyFrameworkSuccess {
        data {
          id
          title
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
  GetFrameworkRootCompetenciesDocument,
  () => ({ id: props.frameworkId }),
  { fetchPolicy: 'network-only' },
);

const competencyFramework = computed(() =>
  result.value?.competencyFramework?.__typename ===
  'QueryCompetencyFrameworkSuccess'
    ? result.value.competencyFramework.data
    : null,
);
</script>

<template>
  <template v-if="error">
    <p>Something went wrong</p>
  </template>
  <template v-else-if="loading">
    <div>Loading</div>
  </template>
  <template v-else-if="competencyFramework == null">
    <p>Not found</p>
  </template>
  <template v-else>
    <UiBreadcrumb>
      <UiBreadcrumbItem link-to="/manage/frameworks">
        <span v-t="'frameworks.route.index.heading'" />
      </UiBreadcrumbItem>
    </UiBreadcrumb>
    <UiTitle is="h1" class="mb-3 text-xl">
      {{ competencyFramework.title }}
    </UiTitle>
    <UiButtonRouterLink
      v-if="ability.can('create', 'Competency')"
      v-t="'frameworks.route.id.index.action.new'"
      class="my-5"
      :to="`/manage/frameworks/${competencyFramework.id}/create-competency`"
    />
    <CompetencyList
      v-if="competencyFramework.competencies.length > 0"
      :framework-id="frameworkId"
      :competencies="competencyFramework.competencies"
      :refetch-queries="['getFrameworkRootCompetencies']"
    />
    <UiEmptyCard v-else>
      <p v-t="'frameworks.route.id.index.notFound'" />
      <UiButtonRouterLink
        v-if="ability.can('create', 'Competency')"
        v-t="'frameworks.route.id.index.action.new'"
        class="my-5"
        :to="`/manage/frameworks/${competencyFramework.id}/create-competency`"
      />
    </UiEmptyCard>
  </template>
</template>
