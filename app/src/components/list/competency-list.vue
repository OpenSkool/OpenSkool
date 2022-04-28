<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { SwapCompetenciesDocument } from '~/codegen/graphql';
import { useI18nStore } from '~/i18n';

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/competencies.*.yaml'));
interface Competency {
  id: string;
  title: string;
}

const { t } = useI18n();

const props = defineProps<{
  competencies: Competency[];
  frameworkId: string;
  refetchQueries: string[];
}>();

gql`
  mutation swapCompetencies($leftCompetencyId: ID!, $rightCompetencyId: ID!) {
    swapCompetencies(
      leftCompetencyId: $leftCompetencyId
      rightCompetencyId: $rightCompetencyId
    ) {
      ... on MutationSwapCompetenciesSuccess {
        __typename
        data {
          left {
            id
          }
          right {
            id
          }
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { mutate: swapCompetencies } = useMutation(SwapCompetenciesDocument, {
  refetchQueries: props.refetchQueries,
});

async function moveCompetency(
  leftCompetencyId: string,
  rightCompetencyId: string,
): Promise<void> {
  const response = await swapCompetencies({
    leftCompetencyId,
    rightCompetencyId,
  });
  if (
    response?.data?.swapCompetencies.__typename !==
    'MutationSwapCompetenciesSuccess'
  ) {
    console.error(
      'unexpected mutation response',
      response?.data?.swapCompetencies,
    );
  }
}
</script>
<template>
  <ol class="list-decimal">
    <li v-for="(competency, index) of competencies" :key="competency.id">
      <router-link :to="`/manage/frameworks/${frameworkId}/${competency.id}`">
        {{ competency.title }}
      </router-link>
      <button
        v-if="index !== 0"
        @click="moveCompetency((competencies[index - 1] as Competency).id, competency.id)"
      >
        <span class="sr-only">{{ t('competencies.list.action.moveUp') }}</span>
        <ri-arrow-up-fill aria-hidden />
      </button>
      <button
        v-if="competencies.length !== index + 1"
        @click="moveCompetency(competency.id, (competencies[index + 1] as Competency).id)"
      >
        <span class="sr-only">{{
          t('competencies.list.action.moveDown')
        }}</span>
        <ri-arrow-down-fill aria-hidden />
      </button>
    </li>
  </ol>
</template>
