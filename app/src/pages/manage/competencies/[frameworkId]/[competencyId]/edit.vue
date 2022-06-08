<script lang="ts" setup>
import { ManageCompetencyEditCompetencyRouteDocument } from '~/codegen/graphql';
import { CompetencyEdit } from '~/domain/competency-management';
import { AuthAccessDeniedLayout } from '~/domain/global';

const props = defineProps<{
  competencyId: string; // route param
  frameworkId: string; // route param
}>();

const ability = useAppAbility();

gql`
  query manageCompetencyEditCompetencyRoute($id: ID!) {
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
  ManageCompetencyEditCompetencyRouteDocument,
  { id: props.competencyId },
  { fetchPolicy: 'network-only' },
);

const competency = computed(() =>
  result.value?.competency?.__typename === 'QueryCompetencySuccess'
    ? result.value.competency.data
    : null,
);
const framework = computed(() => competency.value?.framework);
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem link-to="/manage/competencies">
      <span v-t="'frameworks.route.index.heading'" />
    </UiBreadcrumbItem>
    <UiBreadcrumbItem
      v-if="framework"
      :link-to="`/manage/competencies/${frameworkId}`"
    >
      {{ framework.title }}
    </UiBreadcrumbItem>
    <UiBreadcrumbItem
      v-if="competency"
      :link-to="`/manage/competencies/${frameworkId}/${competencyId}`"
    >
      {{ competency.title }}
    </UiBreadcrumbItem>
  </UiBreadcrumb>
  <AuthAccessDeniedLayout v-if="ability.cannot('update', 'Competency')" />
  <CompetencyEdit
    v-else
    :competency-id="competencyId"
    :framework-id="frameworkId"
  />
</template>
