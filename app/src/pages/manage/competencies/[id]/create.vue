<script lang="ts" setup>
import { GetCompetencyQuery } from '~/generated/graphql';
import { READ_COMPETENCY_QUERY } from '~/gql';

const props = defineProps<{
  id: string; // route param
}>();

const {
  error: readError,
  loading,
  result,
} = useQuery<GetCompetencyQuery>(
  READ_COMPETENCY_QUERY,
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
    <h2 class="text-xl mb-3">Create competency</h2>
    <create-competency :id="id"></create-competency>
  </template>
</template>
