<script lang="ts" setup>
import { ManageCompetencyCreateRootCompetencyRouteDocument } from '~/codegen/graphql';
import { RootCompetencyCreate } from '~/domain/competency-management';
import { AuthAccessDeniedLayout, NotFoundLayout } from '~/domain/global';

const props = defineProps<{
  frameworkId: string; // route param
}>();

const ability = useAppAbility();

gql`
  query manageCompetencyCreateRootCompetencyRoute($id: ID!) {
    competencyFramework(id: $id) {
      ... on QueryCompetencyFrameworkSuccess {
        data {
          title
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { loading, result } = useQuery(
  ManageCompetencyCreateRootCompetencyRouteDocument,
  () => ({ id: props.frameworkId }),
  { fetchPolicy: 'cache-first' },
);

const framework = computed(() =>
  result.value?.competencyFramework?.__typename ===
  'QueryCompetencyFrameworkSuccess'
    ? result.value.competencyFramework.data
    : null,
);
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem link-to="/manage/competencies">
      {{ $t('management.competencyFramework.list.heading') }}
    </UiBreadcrumbItem>
    <UiBreadcrumbItem
      v-if="framework"
      :link-to="`/manage/competencies/${frameworkId}`"
    >
      {{ framework.title }}
    </UiBreadcrumbItem>
  </UiBreadcrumb>
  <AuthAccessDeniedLayout v-if="ability.cannot('create', 'Competency')" />
  <NotFoundLayout v-else-if="framework == null">
    <p>Competency framework not found.</p>
  </NotFoundLayout>
  <template v-else-if="!loading">
    <UiTitle is="h1" class="text-xl mb-3">
      {{ $t('management.competency.create.heading') }}
    </UiTitle>
    <RootCompetencyCreate :framework-id="frameworkId" />
  </template>
</template>
