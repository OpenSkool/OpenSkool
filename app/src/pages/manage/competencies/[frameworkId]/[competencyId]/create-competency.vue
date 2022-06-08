<script lang="ts" setup>
import { ManageCompetencyCreateNestedCompetencyRouteDocument } from '~/codegen/graphql';
import { NestedCompetencyCreate } from '~/domain/competency-management';
import { AuthAccessDeniedLayout } from '~/domain/global';

const props = defineProps<{
  competencyId: string; // route param
  frameworkId: string; // route param
}>();

const ability = useAppAbility();

gql`
  query manageCompetencyCreateNestedCompetencyRoute($id: ID!) {
    competency(id: $id) {
      ... on QueryCompetencySuccess {
        data {
          title
          framework {
            title
          }
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { result } = useQuery(
  ManageCompetencyCreateNestedCompetencyRouteDocument,
  { id: props.competencyId },
  { fetchPolicy: 'network-only' },
);

const parent = computed(() =>
  result.value?.competency?.__typename === 'QueryCompetencySuccess'
    ? result.value.competency.data
    : null,
);
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem link-to="/manage/competencies">
      <span v-t="'frameworks.route.index.heading'" />
    </UiBreadcrumbItem>
    <template v-if="parent">
      <UiBreadcrumbItem :link-to="`/manage/competencies/${frameworkId}`">
        {{ parent.framework.title }}
      </UiBreadcrumbItem>
      <UiBreadcrumbItem
        :link-to="`/manage/competencies/${frameworkId}/${competencyId}`"
      >
        {{ parent.title }}
      </UiBreadcrumbItem>
    </template>
  </UiBreadcrumb>
  <AuthAccessDeniedLayout v-if="ability.cannot('create', 'Competency')" />
  <UiTitle
    is="h1"
    v-t="'competencies.route.create.heading'"
    class="text-xl mb-3"
  />
  <NestedCompetencyCreate
    :competency-id="competencyId"
    :framework-id="frameworkId"
  />
</template>
