<script lang="ts" setup>
import {
  DeleteCompetencyDocument,
  GetSubCompetenciesDocument,
} from '~/codegen/graphql';
import { useI18nStore } from '~/i18n';

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/competencies.*.yaml'));

const { t } = useI18n();

const router = useRouter();

const props = defineProps<{
  competencyId: string;
  frameworkId: string;
}>();

const isDeleteModalOpen = ref(false);
const deleteErrorMessage = ref();

gql`
  query getSubCompetencies($id: ID!) {
    competency(id: $id) {
      __typename
      ... on QueryCompetencySuccess {
        data {
          id
          title
          competencyFramework {
            id
            title
          }
          parent {
            id
            title
          }
          subCompetencies {
            id
            title
          }
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { error, loading, result } = useQuery(
  GetSubCompetenciesDocument,
  () => ({ id: props.competencyId }),
  { fetchPolicy: 'network-only' },
);
const competency = useResult(result);

gql`
  mutation deleteCompetency($id: ID!) {
    deleteCompetency(id: $id) {
      __typename
      ... on MutationDeleteCompetencySuccess {
        data {
          id
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { mutate: deleteCompetency } = useMutation(DeleteCompetencyDocument);

const parent = computed(() => {
  if (competency.value?.__typename === 'QueryCompetencySuccess') {
    if (competency.value.data.parent != null) {
      const { id, title } = competency.value.data.parent;
      return {
        title,
        url: `/manage/frameworks/${props.frameworkId}/${id}`,
      };
    }
    return {
      title: competency.value.data.competencyFramework.title,
      url: `/manage/frameworks/${props.frameworkId}/`,
    };
  }
  return {
    title: t('competencies.route.index.action.backButton'),
    url: '/manage/frameworks/',
  };
});

async function deleteCompetencyHandler(): Promise<void> {
  try {
    deleteErrorMessage.value = null;
    const response = await deleteCompetency({
      id: props.competencyId,
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
  <template v-else-if="competency?.__typename == 'QueryCompetencySuccess'">
    <ui-backbutton :to="`${parent.url}`">
      {{ parent.title }}
    </ui-backbutton>
    <h2 class="text-xl mb-3 flex items-center gap-1">
      {{ competency.data.title }}
      <router-link
        :to="`/manage/frameworks/${frameworkId}/${competencyId}/edit`"
      >
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
      <p class="text-gray-500">{{ competency.data.title }}</p>
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
      :to="`/manage/frameworks/${frameworkId}/${competencyId}/create-competency`"
    >
      {{ t('competencies.route.id.index.action.new') }}
    </router-link>
    <competency-list
      v-if="competency.data.subCompetencies"
      :framework-id="frameworkId"
      :competencies="competency.data.subCompetencies"
      :refetch-queries="['getSubCompetencies']"
    ></competency-list>
  </template>
  <template v-else>
    <div>Not Found</div>
  </template>
</template>
