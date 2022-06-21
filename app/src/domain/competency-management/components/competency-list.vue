<script lang="ts" setup>
import { Competency, SwapCompetenciesDocument } from '~/codegen/graphql';

defineProps<{
  competencies: Array<Pick<Competency, 'id' | 'title'>>;
  frameworkId: string;
  showReorderControls?: boolean;
}>();

const emit = defineEmits<(event: 'swap') => void>();

const { t } = useI18n();

gql`
  mutation swapCompetencies($leftCompetencyId: ID!, $rightCompetencyId: ID!) {
    swapCompetencies(
      leftCompetencyId: $leftCompetencyId
      rightCompetencyId: $rightCompetencyId
    ) {
      ... on MutationSwapCompetenciesSuccess {
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

const { mutate: mutateSwapCompetencies } = useMutation(
  SwapCompetenciesDocument,
);

async function swapCompetencies(
  leftCompetencyId: string,
  rightCompetencyId: string,
): Promise<void> {
  const response = await mutateSwapCompetencies({
    leftCompetencyId,
    rightCompetencyId,
  });
  if (
    response?.data?.swapCompetencies.__typename ===
    'MutationSwapCompetenciesSuccess'
  ) {
    emit('swap');
  } else {
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
      :link-to="`/manage/competencies/${frameworkId}/${competency.id}`"
      :move-up-text="t('management.competency.list.action.moveUp')"
      :move-down-text="t('management.competency.list.action.moveDown')"
      :show-reorder-controls="showReorderControls"
      @move-up="
        swapCompetencies(
          (competencies[index - 1] as Competency).id,
          competency.id,
        )
      "
      @move-down="
        swapCompetencies(
          competency.id,
          (competencies[index + 1] as Competency).id,
        )
      "
    >
      {{ competency.title }}
    </UiOrderedListItem>
  </UiOrderedList>
</template>
