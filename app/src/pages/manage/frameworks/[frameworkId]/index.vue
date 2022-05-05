<script lang="ts" setup>
import { GetFrameworkRootCompetenciesDocument } from '~/codegen/graphql';
import CompetencyList from '~/components/list/competency-list.vue';
import { useI18nStore } from '~/i18n';

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/frameworks.*.yaml'));

const { t } = useI18n();

const props = defineProps<{
  frameworkId: string;
}>();

gql`
  query getFrameworkRootCompetencies($id: ID!) {
    competencyFramework(id: $id) {
      ... on QueryCompetencyFrameworkSuccess {
        data {
          id
          title
          competencies {
            id
            title
          }
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { result, error, loading } = useQuery(
  GetFrameworkRootCompetenciesDocument,
  () => ({ id: props.frameworkId }),
  { fetchPolicy: 'network-only' },
);

const competencyFramework = useResult(result);
</script>

<template>
  <template v-if="error">
    <p>Something went wrong</p>
  </template>
  <template v-else-if="loading">
    <div>Loading</div>
  </template>
  <template
    v-else-if="
      competencyFramework?.__typename === 'QueryCompetencyFrameworkSuccess'
    "
  >
    <ui-backbutton to="/manage/frameworks">
      {{ t('frameworks.route.id.index.action.backButton') }}
    </ui-backbutton>
    <h2 class="text-xl mb-3 flex items-center gap-1">
      {{ competencyFramework.data.title }}
    </h2>
    <h3 class="text-xl">{{ t('frameworks.route.id.index.heading') }}</h3>
    <router-link
      class="btn btn-primary my-5"
      :to="`/manage/frameworks/${competencyFramework.data.id}/create-competency`"
    >
      {{ t('frameworks.route.id.index.action.new') }}
    </router-link>
    <competency-list
      v-if="competencyFramework.data.competencies.length > 0"
      :framework-id="frameworkId"
      :competencies="competencyFramework.data.competencies"
      :refetch-queries="['getFrameworkRootCompetencies']"
    ></competency-list>
  </template>
  <template v-else>
    <div>Not Found</div>
  </template>
</template>
