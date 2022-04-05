<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { GetAllRootCompetenciesDocument } from '~/generated/graphql';
import { useI18nStore } from '~/i18n';

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/competencies.*.yaml'));

const { t } = useI18n();

gql`
  query GetAllRootCompetencies {
    allRootCompetencies {
      id
      title
    }
  }
`;

const { result } = useQuery(GetAllRootCompetenciesDocument);

const competencies = useResult(result);
</script>

<template>
  <h2 class="text-xl mb-3">{{ t('competencies.route.index.heading') }}</h2>
  <router-link class="btn btn-primary my-5" to="/manage/competencies/create">
    {{ t('competencies.route.index.action.create') }}
  </router-link>
  <ol class="list-decimal">
    <li v-for="competency of competencies" :key="competency.id">
      <router-link :to="`/manage/competencies/${competency.id}`">
        {{ competency.title }}
      </router-link>
    </li>
  </ol>
</template>
