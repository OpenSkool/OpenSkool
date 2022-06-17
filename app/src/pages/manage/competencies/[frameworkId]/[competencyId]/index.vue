<script lang="ts" setup>
import {
  DeleteCompetencyDocument,
  ManageCompetencyDetailRouteDocument,
} from '~/codegen/graphql';
import { NestedCompetencyList } from '~/domain/competency-management';
import {
  AuthAccessDeniedLayout,
  ManagementLayout,
  NotFoundLayout,
  useGlobalStore,
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
const globalStore = useGlobalStore();

const isDeleteModalOpen = ref(false);
const showReorderCompetenciesControls = ref(false);
const deleteErrorMessage = ref<string | null>(null);

gql`
  query manageCompetencyDetailRoute($competencyId: ID!, $frameworkId: ID!) {
    competency(id: $competencyId) {
      ... on QueryCompetencySuccess {
        data {
          title
          parent {
            id
            title
          }
        }
      }
      ...BaseErrorFields
    }
    competencyFramework(id: $frameworkId) {
      ... on QueryCompetencyFrameworkSuccess {
        data {
          title
        }
      }
    }
  }
`;

const { loading, onError, result } = useQuery(
  ManageCompetencyDetailRouteDocument,
  () => ({
    competencyId: props.competencyId,
    frameworkId: props.frameworkId,
  }),
  { fetchPolicy: 'network-only' },
);
onError(globalStore.handleApolloError);

const framework = computed(() =>
  result.value?.competencyFramework?.__typename ===
  'QueryCompetencyFrameworkSuccess'
    ? result.value.competencyFramework.data
    : null,
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
        'management.competency.detail.confirmDeleteModal.error.internal',
      );
    }
  } catch {
    deleteErrorMessage.value = t(
      'management.competency.detail.confirmDeleteModal.error.internal',
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
    title: t('management.competency.action.create'),
  },
  {
    action: showReorderArrows,
    icon: 'ri-arrow-up-down-line',
    hasPermission: ability.can('update', 'Competency'),
    title: t('management.competency.list.action.reorder'),
  },
  {
    action: openDeleteModal,
    icon: 'ri-delete-bin-line',
    hasPermission: ability.can('delete', 'Competency'),
    title: t('management.competency.detail.action.delete'),
  },
];
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem link-to="/manage/competencies">
      {{ $t('management.competencyFramework.list.heading') }}
    </UiBreadcrumbItem>
    <UiBreadcrumbItem
      v-if="framework"
      :link-to="`/manage/competencies/${frameworkId}`"
    >
      {{ framework.title }}
    </UiBreadcrumbItem>
    <UiBreadcrumbItem
      v-if="competency?.parent != null"
      :link-to="`/manage/competencies/${frameworkId}/${competency.parent.id}`"
    >
      {{ competency.parent.title }}
    </UiBreadcrumbItem>
  </UiBreadcrumb>
  <AuthAccessDeniedLayout v-if="ability.cannot('read', 'Competency')" />
  <template v-else-if="!loading">
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
          <div
            v-t="'management.competency.detail.action.edit'"
            class="sr-only"
          />
          <RiEditBoxLine aria-hidden />
        </RouterLink>
      </div>
      <ManagementLayout :actions="actions">
        <UiDialog
          implicit-close
          :open="isDeleteModalOpen"
          @close="isDeleteModalOpen = false"
        >
          <UiDialogTitle class="text-danger-600">
            {{ $t('management.competency.detail.confirmDeleteModal.heading') }}
          </UiDialogTitle>
          <UiDialogDescription>
            <i18n-t
              scope="global"
              keypath="management.competency.detail.confirmDeleteModal.description"
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
            <UiButton outline @click="isDeleteModalOpen = false">
              {{
                $t(
                  'management.competency.detail.confirmDeleteModal.action.cancel',
                )
              }}
            </UiButton>
            <UiButton color="danger" @click="deleteCompetencyHandler">
              {{
                $t(
                  'management.competency.detail.confirmDeleteModal.action.confirm',
                )
              }}
            </UiButton>
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
