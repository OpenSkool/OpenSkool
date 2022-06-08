<script lang="ts" setup>
import {
  DeleteCompetencyDocument,
  GetSubCompetenciesDocument,
} from '~/codegen/graphql';
import { ManagementLayout } from '~/domain/global';
import { ActionItem } from '~/types';
import { assert } from '~/utils';

import CompetencyList from './competency-list.vue';

const props = defineProps<{
  competencyId: string;
  frameworkId: string;
}>();

const { t } = useI18n();
const router = useRouter();

const ability = useAppAbility();

const isDeleteModalOpen = ref(false);
const showArrows = ref(false);
const deleteErrorMessage = ref<string | null>(null);

gql`
  query getSubCompetencies($id: ID!) {
    competency(id: $id) {
      __typename
      ... on QueryCompetencySuccess {
        data {
          title
          framework {
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

function openDeleteModal(): void {
  isDeleteModalOpen.value = true;
}

function showReorderArrows(): void {
  showArrows.value = !showArrows.value;
}

const actions: ActionItem[] = [
  {
    action: `/manage/frameworks/${props.frameworkId}/${props.competencyId}/create-competency`,
    icon: 'ri-add-line',
    hasPermission: ability.can('create', 'CompetencyFramework'),
    title: t('competencies.route.id.index.action.new'),
  },
  {
    action: showReorderArrows,
    icon: 'ri-arrow-up-down-line',
    hasPermission: ability.can('update', 'Competency'),
    title: t('competencies.route.id.index.action.sort'),
  },
  {
    action: openDeleteModal,
    icon: 'ri-delete-bin-line',
    hasPermission: ability.can('delete', 'Competency'),
    title: t('competencies.route.id.index.action.openDeleteModal'),
  },
];
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
        {{ competency.framework.title }}
      </UiBreadcrumbItem>
      <UiBreadcrumbItem
        v-if="competency.parent"
        :link-to="`/manage/frameworks/${frameworkId}/${competency.parent.id}`"
      >
        {{ competency.parent.title }}
      </UiBreadcrumbItem>
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
    <ManagementLayout
      :actions="actions"
      :actions-label="t('competencies.route.id.index.actionsLabel')"
    >
      <UiDialog
        implicit-close
        :open="isDeleteModalOpen"
        @close="isDeleteModalOpen = false"
      >
        <UiDialogTitle class="text-danger-600">
          <span
            v-t="'competencies.route.id.index.confirmDeleteModal.heading'"
          />
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
            v-t="
              'competencies.route.id.index.confirmDeleteModal.action.confirm'
            "
            color="danger"
            @click="deleteCompetencyHandler"
          />
        </UiDialogButtons>
      </UiDialog>
      <CompetencyList
        v-if="competency.subCompetencies"
        class="flex-1"
        :competencies="competency.subCompetencies"
        :framework-id="frameworkId"
        :refetch-queries="['getSubCompetencies']"
        :show-arrows="showArrows"
      />
      <UiEmptyCard v-else class="flex-grow">
        <p v-t="'competencies.route.id.index.notFound'" />
        <UiButtonRouterLink
          v-if="ability.can('create', 'Competency')"
          v-t="'competencies.route.id.index.action.new'"
          :to="`/manage/frameworks/${frameworkId}/${competencyId}/create-competency`"
        />
      </UiEmptyCard>
    </ManagementLayout>
  </template>
</template>
