<script lang="ts" setup>
import { GetFrameworkRootCompetenciesDocument } from '~/codegen/graphql';

const ability = useAppAbility();

const props = defineProps<{
  frameworkId: string;
}>();

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

const competencyFramework = useResult(result);
</script>

<template>
  <template v-if="error">
    <p>Something went wrong</p>
  </template>
  <template v-else-if="loading">
    <div>Loading</div>
  </template>
  <template
    v-else-if="
      competencyFramework?.__typename === 'QueryCompetencyFrameworkSuccess'
    "
  >
    <UiBreadcrumb>
      <UiBreadcrumbLink to="/manage/frameworks">
        <span v-t="'frameworks.route.index.heading'" />
      </UiBreadcrumbLink>
    </UiBreadcrumb>
    <UiTitle is="h2" class="text-xl mb-3">
      {{ competencyFramework.data.title }}
    </UiTitle>
    <UiButtonRouterLink
      v-if="ability.can('create', 'Competency')"
      v-t="'frameworks.route.id.index.action.new'"
      class="my-5"
      :to="`/manage/frameworks/${competencyFramework.data.id}/create-competency`"
    />
    <CompetencyList
      v-if="competencyFramework.data.competencies.length > 0"
      :framework-id="frameworkId"
      :competencies="competencyFramework.data.competencies"
      :refetch-queries="['getFrameworkRootCompetencies']"
    />
  </template>
  <template v-else>
    <div>Not Found</div>
  </template>
</template>
