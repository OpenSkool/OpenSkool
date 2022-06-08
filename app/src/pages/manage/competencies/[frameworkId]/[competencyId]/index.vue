<script lang="ts" setup>
import {
  DeleteCompetencyDocument,
  ManageCompetencyDetailRouteDocument,
} from '~/codegen/graphql';
import { NestedCompetencyList } from '~/domain/competency-management';
import {
  AuthAccessDeniedLayout,
  ErrorLayout,
  ManagementLayout,
  NotFoundLayout,
} from '~/domain/global';
import { ActionItem } from '~/types';
import { assert } from '~/utils';

const props = defineProps<{
  competencyId: string; // route param
  frameworkId: string; // route param
}>();

const { t } = useI18n();
const router = useRouter();

const ability = useAppAbility();

const isDeleteModalOpen = ref(false);
const showReorderCompetenciesControls = ref(false);
const deleteErrorMessage = ref<string | null>(null);

gql`
  query manageCompetencyDetailRoute($id: ID!) {
    competency(id: $id) {
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
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { error, loading, result } = useQuery(
  ManageCompetencyDetailRouteDocument,
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
          ? `/manage/competencies/${props.frameworkId}`
          : `/manage/competencies/${props.frameworkId}/${competency.value.parent.id}`,
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
  showReorderCompetenciesControls.value =
    !showReorderCompetenciesControls.value;
}

const actions: ActionItem[] = [
  {
    action: `/manage/competencies/${props.frameworkId}/${props.competencyId}/create-competency`,
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
  <UiBreadcrumb>
    <UiBreadcrumbItem link-to="/manage/competencies">
      <span v-t="'frameworks.route.index.heading'" />
    </UiBreadcrumbItem>
    <template v-if="competency">
      <UiBreadcrumbItem :link-to="`/manage/competencies/${frameworkId}`">
        {{ competency.framework.title }}
      </UiBreadcrumbItem>
      <UiBreadcrumbItem
        v-if="competency.parent"
        :link-to="`/manage/competencies/${frameworkId}/${competency.parent.id}`"
      >
        {{ competency.parent.title }}
      </UiBreadcrumbItem>
    </template>
  </UiBreadcrumb>
  <AuthAccessDeniedLayout v-if="ability.cannot('read', 'Competency')" />
  <ErrorLayout v-else-if="error">
    <p>Competency failed to load.</p>
  </ErrorLayout>
  <template v-if="!loading">
    <NotFoundLayout v-if="competency == null">
      <p>Competency not found.</p>
    </NotFoundLayout>
    <template v-else>
      <div class="flex gap-3 items-baseline">
        <UiTitle is="h1" class="text-xl mb-3">
          {{ competency.title }}
        </UiTitle>
        <RouterLink
          v-if="ability.can('update', 'Competency')"
          :to="`/manage/competencies/${frameworkId}/${competencyId}/edit`"
        >
          <span
            v-t="'competencies.route.id.index.action.edit'"
            class="sr-only"
          />
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
              v-t="
                'competencies.route.id.index.confirmDeleteModal.action.cancel'
              "
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
        <NestedCompetencyList
          :competency-id="competencyId"
          :framework-id="frameworkId"
          :show-reorder-controls="showReorderCompetenciesControls"
        />
      </ManagementLayout>
    </template>
  </template>
</template>
