<script lang="ts" setup>
import { useAuthStore } from '~/auth';
import { GetCreateCompetencyParentDocument } from '~/codegen/graphql';
import { useI18nStore } from '~/i18n';

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/competencies.*.yaml'));

const authStore = useAuthStore();

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
  <template v-if="authStore.isLoggedIn">
    <template v-if="getCreateCompetencyParentError">
      <p>Something went wrong</p>
    </template>
    <template v-else-if="loading">
      <div>Loading</div>
    </template>
    <template v-else>
      <UiBreadcrumb>
        <UiBreadcrumbLink to="/manage/frameworks">
          <span v-t="'frameworks.route.index.heading'" />
        </UiBreadcrumbLink>
        <template v-if="parentCompetency">
          <UiBreadcrumbLink :to="`/manage/frameworks/${frameworkId}`">
            {{ parentCompetency.competencyFramework.title }}
          </UiBreadcrumbLink>
          <UiBreadcrumbLink
            :to="`/manage/frameworks/${frameworkId}/${competencyId}`"
          >
            {{ parentCompetency.title }}
          </UiBreadcrumbLink>
        </template>
      </UiBreadcrumb>
      <UiTitle v-t="'competencies.route.create.heading'" class="text-xl mb-3" />
      <NestedCompetencyCreate
        :competency-id="competencyId"
        :framework-id="frameworkId"
      />
    </template>
  </template>
  <template v-else>
    <AuthAccessDenied />
  </template>
</template>
