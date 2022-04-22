<route lang="yaml">
meta:
  requireDemoUser: true
</route>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { GetCompetencyFrameworkQuery } from '~/generated/graphql';
import { useI18nStore } from '~/i18n';

const props = defineProps<{
  frameworkId: string;
}>();

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/competencies.*.yaml'));

const { t } = useI18n();

const { error, loading, result } = useQuery<GetCompetencyFrameworkQuery>(
  gql`
    query getCompetencyFramework($id: ID!) {
      competencyFramework(id: $id) {
        id
        title
      }
    }
  `,
  () => ({ id: props.frameworkId }),
  { fetchPolicy: 'cache-first' },
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
    <ui-backbutton :to="`/manage/frameworks/${competencyFramework?.id}`">
      {{ competencyFramework.title }}
    </ui-backbutton>
    <h2 class="text-xl mb-3">
      {{ t('competencies.route.create.heading') }}
    </h2>
    <create-root-competency
      :framework-id="props.frameworkId"
    ></create-root-competency>
  </template>
</template>
