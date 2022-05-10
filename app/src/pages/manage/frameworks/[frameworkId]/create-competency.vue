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
const competencyFramework = useResult(result);
</script>

<template>
  <template v-if="authStore.isLoggedIn">
    <template v-if="error">
      <p>Something went wrong</p>
    </template>
    <template v-else-if="loading">
      <div>Loading</div>
    </template>
    <template
      v-else-if="
        competencyFramework?.__typename == 'QueryCompetencyFrameworkSuccess'
      "
    >
      <UiBackbutton :to="`/manage/frameworks/${competencyFramework.data.id}`">
        {{ competencyFramework.data.title }}
      </UiBackbutton>
      <UiTitle
        is="h2"
        v-t="'competencies.route.create.heading'"
        class="text-xl mb-3"
      />
      <CreateRootCompetency :framework-id="props.frameworkId" />
    </template>
    <template v-else>
      <div>Not Found</div>
    </template>
  </template>
  <template v-else>
    <AuthAccessDenied />
  </template>
</template>
