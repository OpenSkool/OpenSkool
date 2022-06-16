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
  query manageCompetencyCreateNestedCompetencyRoute(
    $competencyId: ID!
    $frameworkId: ID!
  ) {
    competency(id: $competencyId) {
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
    competencyFramework(id: $frameworkId) {
      ... on QueryCompetencyFrameworkSuccess {
        data {
          title
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { result } = useQuery(
  ManageCompetencyCreateNestedCompetencyRouteDocument,
  props,
  { fetchPolicy: 'network-only' },
);

const framework = computed(() =>
  result.value?.competencyFramework?.__typename ===
  'QueryCompetencyFrameworkSuccess'
    ? result.value.competencyFramework.data
    : null,
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
      {{ $t('frameworks.route.index.heading') }}
    </UiBreadcrumbItem>
    <UiBreadcrumbItem
      v-if="framework"
      :link-to="`/manage/competencies/${frameworkId}`"
    >
      {{ framework.title }}
    </UiBreadcrumbItem>
    <UiBreadcrumbItem
      v-if="parent"
      :link-to="`/manage/competencies/${frameworkId}/${competencyId}`"
    >
      {{ parent.title }}
    </UiBreadcrumbItem>
  </UiBreadcrumb>
  <AuthAccessDeniedLayout v-if="ability.cannot('create', 'Competency')" />
  <template v-else>
    <UiTitle is="h1" class="text-xl mb-3">
      {{ $t('competencies.route.create.heading') }}
    </UiTitle>
    <NestedCompetencyCreate
      :competency-id="competencyId"
      :framework-id="frameworkId"
    />
  </template>
</template>