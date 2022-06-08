<script lang="ts" setup>
import { SwapCompetenciesDocument } from '~/codegen/graphql';

interface Competency {
  id: string;
  title: string;
}

const props = defineProps<{
  showArrows: boolean;
  competencies: Competency[];
  frameworkId: string;
  refetchQueries: string[];
}>();

const { t } = useI18n();

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
  <UiOrderedList class="flex-1">
    <UiOrderedListItem
      v-for="(competency, index) of competencies"
      :key="competency.id"
      :link-to="`/manage/competencies/${frameworkId}/${competency.id}`"
      :move-up-text="t('competencies.list.action.moveUp')"
      :move-down-text="t('competencies.list.action.moveDown')"
      :show-arrows="showArrows"
      @move-up="moveCompetency((competencies[index - 1] as Competency).id, competency.id)"
      @move-down="moveCompetency(competency.id, (competencies[index + 1] as Competency).id)"
    >
      {{ competency.title }}
    </UiOrderedListItem>
  </UiOrderedList>
</template>
