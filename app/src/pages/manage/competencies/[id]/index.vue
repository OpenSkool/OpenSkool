<script lang="ts" setup>
import {
  GetSubCompetenciesQuery,
  DeleteCompetencyMutation,
  DeleteCompetencyMutationVariables,
} from '~/generated/graphql';

import { useI18n } from 'vue-i18n';
import { useI18nStore } from '~/i18n';
const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/competencies.*.yaml'));

const { t } = useI18n();

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
      deleteErrorMessage.value = t(
        'competencies.route.id.index.confirmDeleteModal.error',
      );
    }
  } catch {
    deleteErrorMessage.value = t(
      'competencies.route.id.index.confirmDeleteModal.error',
    );
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
        <span class="sr-only">{{
          t('competencies.route.id.index.action.edit')
        }}</span>
        <ri-edit-box-fill aria-hidden />
      </router-link>
    </h2>
    <button
      class="btn btn-primary mb-3"
      type="button"
      @click="isDeleteModalOpen = true"
    >
      {{ t('competencies.route.id.index.action.openDeleteModal') }}
    </button>
    <ui-dialog :open="isDeleteModalOpen" @close="isDeleteModalOpen = false">
      <template #title>{{
        t('competencies.route.id.index.confirmDeleteModal.heading')
      }}</template>
      <p>
        {{ t('competencies.route.id.index.confirmDeleteModal.message') }}
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
          {{ t('competencies.route.id.index.confirmDeleteModal.action.abort') }}
        </button>
        <button
          class="btn btn-primary"
          type="button"
          @click="deleteCompetencyHandler"
        >
          {{
            t('competencies.route.id.index.confirmDeleteModal.action.confirm')
          }}
        </button>
      </div>
    </ui-dialog>
    <h3 class="text-xl">{{ t('competencies.route.id.index.heading') }}</h3>
    <router-link
      class="btn btn-primary my-5"
      :to="`/manage/competencies/${competency.id}/create`"
    >
      {{ t('competencies.route.id.index.action.new') }}
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
