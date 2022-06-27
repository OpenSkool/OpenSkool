<script lang="ts" setup>
import {
  DeleteCompetencyDocument,
  ManageCompetencyDetailRouteDocument,
} from '~/codegen/graphql';
import { NestedCompetencyList } from '~/domain/competency-management';
import {
  AuthAccessDeniedLayout,
  NotFoundLayout,
  useGlobalStore,
} from '~/domain/global';
import {
  ManagementLayout,
  ManagementLayoutItem,
  ManagementLayoutLink,
} from '~/domain/management';
import { useHead } from '~/i18n';
import { assert } from '~/utils';

import RiAddLine from '~icons/ri/add-line';
import RiArrowUpDownLine from '~icons/ri/arrow-up-down-line';
import RiDeleteBinLine from '~icons/ri/delete-bin-line';

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

useHead(() => ({
  title: competency.value?.title,
}));

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
      <p v-t="'management.competency.error.notFound'" />
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
      <ManagementLayout>
        <template #actions>
          <ManagementLayoutLink
            v-if="ability.can('create', 'Competency')"
            :icon="RiAddLine"
            :to="`/manage/competencies/${props.frameworkId}/${props.competencyId}/create-competency`"
          >
            {{ $t('management.competency.action.create') }}
          </ManagementLayoutLink>
          <ManagementLayoutItem
            is="button"
            v-if="ability.can('update', 'Competency')"
            :icon="RiArrowUpDownLine"
            @click="
              showReorderCompetenciesControls = !showReorderCompetenciesControls
            "
          >
            {{ $t('management.competency.list.action.reorder') }}
          </ManagementLayoutItem>
          <ManagementLayoutItem
            is="button"
            v-if="ability.can('delete', 'Competency')"
            :icon="RiDeleteBinLine"
            @click="isDeleteModalOpen = true"
          >
            {{ $t('management.competency.detail.action.delete') }}
          </ManagementLayoutItem>
        </template>
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
