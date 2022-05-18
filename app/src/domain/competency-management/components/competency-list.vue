<script lang="ts" setup>
import { SwapCompetenciesDocument } from '~/codegen/graphql';

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
  <UiOrderedList>
    <UiOrderedListItem
      v-for="(competency, index) of competencies"
      :key="competency.id"
      :move-up-text="t('competencies.list.action.moveUp')"
      :move-down-text="t('competencies.list.action.moveDown')"
      :show-arrows="true"
      @move-up="moveCompetency((competencies[index - 1] as Competency).id, competency.id)"
      @move-down="moveCompetency(competency.id, (competencies[index + 1] as Competency).id)"
    >
      <RouterLink :to="`/manage/frameworks/${frameworkId}/${competency.id}`">
        {{ competency.title }}
      </RouterLink>
    </UiOrderedListItem>
  </UiOrderedList>
</template>
