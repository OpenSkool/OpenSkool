<script lang="ts" setup>
import { GetAllCompetencyFrameworksDocument } from '~/codegen/graphql';
import { useI18nStore } from '~/i18n';

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/frameworks.*.yaml'));

const { t } = useI18n();

gql`
  query GetAllCompetencyFrameworks {
    allCompetencyFrameworks {
      id
      title
    }
  }
`;

const { result } = useQuery(GetAllCompetencyFrameworksDocument);

const frameworks = useResult(result);
</script>

<template>
  <h2 class="text-xl mb-3">{{ t('frameworks.route.index.heading') }}</h2>
  <router-link
    class="btn btn-primary my-5"
    to="/manage/frameworks/create-framework"
  >
    {{ t('frameworks.route.index.action.create') }}
  </router-link>
  <ol class="list-decimal">
    <li v-for="framework of frameworks" :key="framework.id">
      <router-link :to="`/manage/frameworks/${framework.id}`">
        {{ framework.title }}
      </router-link>
    </li>
  </ol>
</template>
