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
const deleteErrorMessage = ref();

const { error, loading, result } = useQuery<GetSubCompetenciesQuery>(
  gql`
    query getSubCompetencies($id: ID!) {
      competency(id: $id) {
        id
        title
        ... on NestedCompetency {
          parent {
            id
            title
          }
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

const parent = computed(() => {
  if (
    competency.value != null &&
    competency.value.__typename === 'NestedCompetency'
  ) {
    return {
      title: competency.value.parent.title,
      url: `/manage/competencies/${competency.value.parent.id}`,
    };
  }
  return { title: 'Manage competencies', url: '/manage/competencies' };
});

async function deleteCompetencyHandler(): Promise<void> {
  try {
    deleteErrorMessage.value = null;
    const response = await deleteCompetency({
      id: props.id,
    });
    if (response?.data) {
      isDeleteModalOpen.value = false;
      router.replace(parent.value.url);
    } else {
      deleteErrorMessage.value =
        'Something went wrong: competency could not be deleted.';
    }
  } catch {
    deleteErrorMessage.value =
      'Something went wrong: competency could not be deleted.';
  }
}
</script>

<template>
  <template v-if="error">
    <p>Something went wrong</p>
  </template>
  <template v-else-if="loading">
    <div>Loading</div>
  </template>
  <template v-else-if="competency == null">
    <div>Not Found</div>
  </template>
  <template v-else>
    <ui-backbutton :to="`${parent.url}`">
      {{ parent.title }}
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
      <p v-if="deleteErrorMessage" class="text-red-600">
        {{ deleteErrorMessage }}
      </p>
      <div class="mt-4">
        <button
          class="btn btn-cancel mr-3"
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
