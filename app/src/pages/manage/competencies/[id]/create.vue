<route lang="yaml">
meta:
  requireDemoUser: true
</route>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { GetCompetencyDocument } from '~/generated/graphql';
import { useI18nStore } from '~/i18n';

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/competencies.*.yaml'));

const { t } = useI18n();

const props = defineProps<{
  id: string; // route param
}>();

const {
  error: readError,
  loading,
  result,
} = useQuery(
  GetCompetencyDocument,
  { id: props.id },
  { fetchPolicy: 'network-only' },
);
const competency = useResult(result);
</script>

<template>
  <template v-if="readError">
    <p>Something went wrong</p>
  </template>
  <template v-else-if="loading">
    <div>Loading</div>
  </template>
  <template v-else-if="competency == null">
    <div>Not Found</div>
  </template>
  <template v-else>
    <ui-backbutton :to="`/manage/competencies/${id}`">
      {{ competency.title }}
    </ui-backbutton>
    <h2 class="text-xl mb-3">
      {{ t('competencies.route.id.create.heading') }}
    </h2>
    <create-competency :id="id"></create-competency>
  </template>
</template>
