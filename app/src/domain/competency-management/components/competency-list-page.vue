<script lang="ts" setup>
import {
  DeleteCompetencyDocument,
  GetSubCompetenciesDocument,
} from '~/codegen/graphql';
import CompetencyList from '~/domain/competency-management/components/competency-list.vue';
import { assert } from '~/utils';

const props = defineProps<{
  competencyId: string;
  frameworkId: string;
}>();

const { t } = useI18n();
const router = useRouter();

const ability = useAppAbility();

const isDeleteModalOpen = ref(false);
const deleteErrorMessage = ref<string | null>(null);

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
      <UiBreadcrumbItem link-to="/manage/frameworks">
        <span v-t="'frameworks.route.index.heading'" />
      </UiBreadcrumbItem>
      <UiBreadcrumbItem :link-to="`/manage/frameworks/${frameworkId}`">
        {{ competency.competencyFramework.title }}
      </UiBreadcrumbItem>
      <UiBreadcrumbItem
        v-if="competency.parent"
        :link-to="`/manage/frameworks/${frameworkId}/${competency.parent.id}`"
      >
        {{ competency.parent.title }}
      </UiBreadcrumbItem>
    </UiBreadcrumb>
    <div class="flex items-baseline gap-3">
      <UiTitle is="h1" class="mb-3 text-xl">
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
      <UiDialogTitle class="text-danger-600">
        <span v-t="'competencies.route.id.index.confirmDeleteModal.heading'" />
      </UiDialogTitle>
      <UiDialogDescription>
        <i18n-t
          scope="global"
          keypath="competencies.route.id.index.confirmDeleteModal.message"
        >
          <template #title>
            <strong class="text-danger-500">{{ competency.title }}</strong>
          </template>
        </i18n-t>
      </UiDialogDescription>
      <p v-if="deleteErrorMessage" class="text-danger-600">
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
    <UiEmptyCard v-else>
      <p v-t="'competencies.route.id.index.notFound'" />
      <UiButtonRouterLink
        v-if="ability.can('create', 'Competency')"
        v-t="'competencies.route.id.index.action.new'"
        :to="`/manage/frameworks/${frameworkId}/${competencyId}/create-competency`"
      />
    </UiEmptyCard>
  </template>
</template>
