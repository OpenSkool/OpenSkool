<script lang="ts" setup>
import {
  GetSubCompetenciesQuery,
  DeleteCompetencyMutation,
  DeleteCompetencyMutationVariables,
} from '~/generated/graphql';

const router = useRouter();

const props = defineProps<{
  id: string; // route param
}>();

const isDeleteModalOpen = ref(false);
const parentUrl = ref('/manage/competencies');

const { error, loading, result } = useQuery<GetSubCompetenciesQuery>(
  gql`
    query getSubCompetencies($id: ID!) {
      competency(id: $id) {
        id
        title
        ... on NestedCompetency {
          parentId
        }
        subCompetencies {
          id
          title
        }
      }
    }
  `,
  () => ({ id: props.id }),
  { fetchPolicy: 'network-only' },
);
const competency = useResult(result);

const { mutate: deleteCompetency } = useMutation<
  DeleteCompetencyMutation,
  DeleteCompetencyMutationVariables
>(gql`
  mutation DeleteCompetency($id: ID!) {
    deleteCompetency(id: $id) {
      id
    }
  }
`);

async function deleteCompetencyHandler(): Promise<void> {
  try {
    // TO DO: error handling for deleteCompetency
    await deleteCompetency({
      id: props.id,
    });
    isDeleteModalOpen.value = false;
    router.replace(parentUrl.value);
  } catch {
    throw new Error('Something went wrong');
  }
}

watch(competency, () => {
  /* eslint-disable no-underscore-dangle */
  if (
    competency.value != null &&
    competency.value.__typename === 'NestedCompetency'
  ) {
    parentUrl.value = `/manage/competencies/${competency.value.parentId}`;
  } else {
    parentUrl.value = '/manage/competencies';
  }
});
</script>

<template>
  <template v-if="error">
    <p>Something went wrong</p>
  </template>
  <template v-else-if="loading">
    <div>Loading</div>
  </template>
  <template v-if="competency == null">
    <div>Not Found</div>
  </template>
  <template v-else>
    <ui-backbutton :to="`${parentUrl}`">
      Back
      <!-- TODO: replace "Back" with title of parent when available in API -->
    </ui-backbutton>
    <h2 class="text-xl mb-3 flex items-center gap-1">
      {{ competency.title }}
      <router-link :to="`/manage/competencies/${competency.id}/edit`">
        <span class="sr-only">Edit</span>
        <ri-edit-box-fill aria-hidden />
      </router-link>
    </h2>
    <button
      class="btn btn-primary mb-3"
      type="button"
      @click="isDeleteModalOpen = true"
    >
      Delete competency
    </button>
    <ui-dialog :open="isDeleteModalOpen" @close="isDeleteModalOpen = false">
      <template #title>Delete competency?</template>
      <p>
        Are you sure you want to delete this competency and all its children?
      </p>
      <p class="text-gray-500">{{ competency.title }}</p>
      <div class="mt-4">
        <button
          class="btn bg-gray-300 hover:bg-gray-400 mr-3"
          type="button"
          @click="isDeleteModalOpen = false"
        >
          keep
        </button>
        <button
          class="btn btn-primary"
          type="button"
          @click="deleteCompetencyHandler"
        >
          Delete
        </button>
      </div>
    </ui-dialog>
    <h3 class="text-xl">Sub-competencies</h3>
    <router-link
      class="btn btn-primary my-5"
      :to="`/manage/competencies/${competency.id}/create`"
    >
      New
    </router-link>
    <ol class="list-decimal">
      <li
        v-for="subCompetency of competency.subCompetencies"
        :key="subCompetency.id"
      >
        <router-link :to="`/manage/competencies/${subCompetency.id}`">
          {{ subCompetency.title }}
        </router-link>
      </li>
    </ol>
  </template>
</template>
