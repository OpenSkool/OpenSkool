<script lang="ts" setup>
import { useAuthStore } from '~/auth';
import { GetCompetencyFrameworkDocument } from '~/codegen/graphql';
import { useI18nStore } from '~/i18n';

const authStore = useAuthStore();

const props = defineProps<{
  frameworkId: string;
}>();

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/competencies.*.yaml'));

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
  <template v-if="authStore.isLoggedIn">
    <template v-if="error">
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
        <UiBreadcrumbLink
          v-if="competencyFramework"
          :to="`/manage/frameworks/${competencyFramework.id}`"
        >
          {{ competencyFramework.title }}
        </UiBreadcrumbLink>
      </UiBreadcrumb>
      <UiTitle
        is="h2"
        v-t="'competencies.route.create.heading'"
        class="text-xl mb-3"
      />
      <RootCompetencyCreate :framework-id="props.frameworkId" />
    </template>
  </template>
  <template v-else>
    <AuthAccessDenied />
  </template>
</template>
