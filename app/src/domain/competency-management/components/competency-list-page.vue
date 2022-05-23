<script lang="ts" setup>
import {
  DeleteCompetencyDocument,
  GetSubCompetenciesDocument,
} from '~/codegen/graphql';
import { assert } from '~/utils';

const { t } = useI18n();
const ability = useAppAbility();

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
          title
          competencyFramework {
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
const competency = computed(() =>
  result.value?.competency?.__typename === 'QueryCompetencySuccess'
    ? result.value.competency.data
    : null,
);

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

async function deleteCompetencyHandler(): Promise<void> {
  assert(competency.value, 'competency is not defined');
  try {
    deleteErrorMessage.value = null;
    const response = await deleteCompetency({
      id: props.competencyId,
    });
    if (response?.data) {
      isDeleteModalOpen.value = false;
      router.replace(
        competency.value.parent == null
          ? `/manage/frameworks/${props.frameworkId}`
          : `/manage/frameworks/${props.frameworkId}/${competency.value.parent.id}`,
      );
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
    <p>Not found.</p>
  </template>
  <template v-else>
    <UiBreadcrumb>
      <UiBreadcrumbLink to="/manage/frameworks">
        <span v-t="'frameworks.route.index.heading'" />
      </UiBreadcrumbLink>
      <UiBreadcrumbLink :to="`/manage/frameworks/${frameworkId}`">
        {{ competency.competencyFramework.title }}
      </UiBreadcrumbLink>
      <UiBreadcrumbLink
        v-if="competency.parent"
        :to="`/manage/frameworks/${frameworkId}/${competency.parent.id}`"
      >
        {{ competency.parent.title }}
      </UiBreadcrumbLink>
    </UiBreadcrumb>
    <div class="flex gap-3 items-baseline">
      <UiTitle is="h1" class="text-xl mb-3">
        {{ competency.title }}
      </UiTitle>
      <RouterLink
        v-if="ability.can('update', 'Competency')"
        :to="`/manage/frameworks/${frameworkId}/${competencyId}/edit`"
      >
        <span v-t="'competencies.route.id.index.action.edit'" class="sr-only" />
        <RiEditBoxLine aria-hidden />
      </RouterLink>
    </div>
    <UiButtonRouterLink
      v-if="ability.can('create', 'Competency')"
      v-t="'competencies.route.id.index.action.new'"
      class="m-5"
      :to="`/manage/frameworks/${frameworkId}/${competencyId}/create-competency`"
    />
    <UiButton
      v-if="ability.can('delete', 'Competency')"
      v-t="'competencies.route.id.index.action.openDeleteModal'"
      class="mb-3"
      @click="isDeleteModalOpen = true"
    />
    <UiDialog
      implicit-close
      :open="isDeleteModalOpen"
      @close="isDeleteModalOpen = false"
    >
      <UiDialogTitle class="text-danger-300">
        <span v-t="'competencies.route.id.index.confirmDeleteModal.heading'" />
      </UiDialogTitle>
      <UiDialogDescription>
        <i18n-t
          keypath="competencies.route.id.index.confirmDeleteModal.message"
        >
          <template #title>
            <strong class="text-secondary-300">{{ competency.title }}</strong>
          </template>
        </i18n-t>
      </UiDialogDescription>
      <p v-if="deleteErrorMessage" class="text-danger-400">
        {{ deleteErrorMessage }}
      </p>
      <UiDialogButtons>
        <UiButton
          v-t="'competencies.route.id.index.confirmDeleteModal.action.cancel'"
          outline
          @click="isDeleteModalOpen = false"
        />
        <UiButton
          v-t="'competencies.route.id.index.confirmDeleteModal.action.confirm'"
          color="danger"
          @click="deleteCompetencyHandler"
        />
      </UiDialogButtons>
    </UiDialog>
    <CompetencyList
      v-if="competency.subCompetencies"
      :framework-id="frameworkId"
      :competencies="competency.subCompetencies"
      :refetch-queries="['getSubCompetencies']"
    />
  </template>
</template>
