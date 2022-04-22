<route lang="yaml">
meta:
  requireDemoUser: true
</route>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { GetCreateCompetencyParentDocument } from '~/generated/graphql';
import { useI18nStore } from '~/i18n';

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/competencies.*.yaml'));

const { t } = useI18n();

const props = defineProps<{
  competencyId: string;
  frameworkId: string;
}>();

gql`
  query getCreateCompetencyParent($id: ID!) {
    competency(id: $id) {
      title
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
const competency = useResult(result);
</script>

<template>
  <template v-if="getCreateCompetencyParentError">
    <p>Something went wrong</p>
  </template>
  <template v-else-if="loading">
    <div>Loading</div>
  </template>
  <template v-else-if="competency == null">
    <div>Not Found</div>
  </template>
  <template v-else>
    <ui-backbutton :to="`/manage/frameworks/${frameworkId}/${competencyId}`">
      {{ competency.title }}
    </ui-backbutton>
    <h2 class="text-xl mb-3">
      {{ t('competencies.route.id.create.heading') }}
    </h2>
    <create-competency-form
      :competency-id="competencyId"
      :framework-id="frameworkId"
    ></create-competency-form>
  </template>
</template>
