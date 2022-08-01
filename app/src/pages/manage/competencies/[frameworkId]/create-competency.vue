<script lang="ts" setup>
import { ManageCompetencyCreateRootCompetencyRouteDocument } from '~/codegen/graphql';
import { RootCompetencyCreate } from '~/domain/competency-management';
import { AuthAccessDeniedLayout, NotFoundLayout } from '~/domain/global';
import { useHead } from '~/i18n';

const route = useRoute();
const frameworkId = computed((): string => route.params.frameworkId as string);

const ability = useAppAbility();

useHead(({ t }) => ({
  title: t('management.competency.create.heading'),
}));

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
  () => ({ id: frameworkId.value }),
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
  <template v-else-if="!loading">
    <NotFoundLayout v-if="framework == null">
      <p>Competency framework not found.</p>
    </NotFoundLayout>
    <template v-else>
      <UiTitle is="h1" class="text-xl mb-3">
        {{ $t('management.competency.create.heading') }}
      </UiTitle>
      <RootCompetencyCreate :framework-id="frameworkId" />
    </template>
  </template>
</template>
