<script lang="ts" setup>
import { GetCreateCompetencyParentDocument } from '~/codegen/graphql';
import NestedCompetencyCreate from '~/domain/competency-management/components/nested-competency-create.vue';

const props = defineProps<{
  competencyId: string;
  frameworkId: string;
}>();

gql`
  query getCreateCompetencyParent($id: ID!) {
    competency(id: $id) {
      ... on QueryCompetencySuccess {
        data {
          title
          competencyFramework {
            title
          }
        }
      }
      ...BaseErrorFields
    }
  }
`;

const {
  error: getCreateCompetencyParentError,
  loading,
  result,
} = useQuery(
  GetCreateCompetencyParentDocument,
  { id: props.competencyId },
  { fetchPolicy: 'network-only' },
);
const parentCompetency = computed(() =>
  result.value?.competency?.__typename === 'QueryCompetencySuccess'
    ? result.value.competency.data
    : null,
);
</script>

<template>
  <template v-if="getCreateCompetencyParentError">
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
      <template v-if="parentCompetency">
        <UiBreadcrumbItem :link-to="`/manage/frameworks/${frameworkId}`">
          {{ parentCompetency.competencyFramework.title }}
        </UiBreadcrumbItem>
        <UiBreadcrumbItem
          :link-to="`/manage/frameworks/${frameworkId}/${competencyId}`"
        >
          {{ parentCompetency.title }}
        </UiBreadcrumbItem>
      </template>
    </UiBreadcrumb>
    <UiTitle
      is="h1"
      v-t="'competencies.route.create.heading'"
      class="mb-3 text-xl"
    />
    <NestedCompetencyCreate
      :competency-id="competencyId"
      :framework-id="frameworkId"
    />
  </template>
</template>
