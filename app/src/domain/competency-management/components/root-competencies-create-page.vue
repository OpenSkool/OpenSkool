<script lang="ts" setup>
import { GetCompetencyFrameworkDocument } from '~/codegen/graphql';

const props = defineProps<{
  frameworkId: string;
}>();

gql`
  query getCompetencyFramework($id: ID!) {
    competencyFramework(id: $id) {
      ... on QueryCompetencyFrameworkSuccess {
        data {
          id
          title
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { error, loading, result } = useQuery(
  GetCompetencyFrameworkDocument,
  () => ({ id: props.frameworkId }),
  { fetchPolicy: 'cache-first' },
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
  <template v-else>
    <UiBreadcrumb>
      <UiBreadcrumbItem link-to="/manage/frameworks">
        <span v-t="'frameworks.route.index.heading'" />
      </UiBreadcrumbItem>
      <UiBreadcrumbItem
        v-if="competencyFramework"
        :to="`/manage/frameworks/${competencyFramework.id}`"
      >
        {{ competencyFramework.title }}
      </UiBreadcrumbItem>
    </UiBreadcrumb>
    <UiTitle
      is="h1"
      v-t="'competencies.route.create.heading'"
      class="text-xl mb-3"
    />
    <RootCompetencyCreate :framework-id="props.frameworkId" />
  </template>
</template>
