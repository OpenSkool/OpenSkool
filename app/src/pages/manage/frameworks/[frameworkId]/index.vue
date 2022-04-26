<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import CompetencyList from '~/components/list/competency-list.vue';
import { GetFrameworkRootCompetenciesDocument } from '~/generated/graphql';
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
      id
      title
      competencies {
        id
        title
      }
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
  <template v-else-if="competencyFramework == null">
    <div>Not Found</div>
  </template>
  <template v-else>
    <ui-backbutton to="/manage/frameworks">
      {{ t('frameworks.route.id.index.action.backButton') }}
    </ui-backbutton>
    <h2 class="text-xl mb-3 flex items-center gap-1">
      {{ competencyFramework.title }}
    </h2>
    <h3 class="text-xl">{{ t('frameworks.route.id.index.heading') }}</h3>
    <router-link
      class="btn btn-primary my-5"
      :to="`/manage/frameworks/${competencyFramework.id}/create-competency`"
    >
      {{ t('frameworks.route.id.index.action.new') }}
    </router-link>
    <competency-list
      v-if="competencyFramework.competencies.length > 0"
      :framework-id="frameworkId"
      :competencies="competencyFramework.competencies"
      :refetch-queries="['getFrameworkRootCompetencies']"
    ></competency-list>
  </template>
</template>
