<script lang="ts" setup>
import { GetAllCompetencyFrameworksDocument } from '~/codegen/graphql';

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
  <UiOrderedList>
    <UiOrderedListItem v-for="framework of frameworks" :key="framework.id">
      <RouterLink :to="`/manage/frameworks/${framework.id}`">
        {{ framework.title }}
      </RouterLink>
    </UiOrderedListItem>
  </UiOrderedList>
</template>
