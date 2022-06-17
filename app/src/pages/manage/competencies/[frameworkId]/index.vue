<script lang="ts" setup>
import { ManageCompetencyFrameworkDetailRouteDocument } from '~/codegen/graphql';
import { RootCompetencyList } from '~/domain/competency-management';
import {
  AuthAccessDeniedLayout,
  ManagementLayout,
  NotFoundLayout,
} from '~/domain/global';
import { ActionItem } from '~/types';

const props = defineProps<{
  frameworkId: string; // route param
}>();

const { t } = useI18n();
const ability = useAppAbility();

gql`
  query manageCompetencyFrameworkDetailRoute($id: ID!) {
    competencyFramework(id: $id) {
      ... on QueryCompetencyFrameworkSuccess {
        data {
          id
          title
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { loading, result } = useQuery(
  ManageCompetencyFrameworkDetailRouteDocument,
  () => ({ id: props.frameworkId }),
  { fetchPolicy: 'network-only' },
);
const competencyFramework = computed(() =>
  result.value?.competencyFramework?.__typename ===
  'QueryCompetencyFrameworkSuccess'
    ? result.value.competencyFramework.data
    : null,
);

const showReorderCompetenciesControls = ref(false);

const actions: ActionItem[] = [
  {
    action: `/manage/competencies/${props.frameworkId}/create-competency`,
    icon: 'ri-add-line',
    hasPermission: ability.can('create', 'Competency'),
    title: t('management.competency.action.create'),
  },
  {
    action(): void {
      showReorderCompetenciesControls.value =
        !showReorderCompetenciesControls.value;
    },
    icon: 'ri-arrow-up-down-line',
    hasPermission: ability.can('update', 'Competency'),
    title: t('management.competency.list.action.reorder'),
  },
];
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem link-to="/manage/competencies">
      {{ $t('management.competencyFramework.list.heading') }}
    </UiBreadcrumbItem>
  </UiBreadcrumb>
  <AuthAccessDeniedLayout
    v-if="ability.cannot('read', 'CompetencyFramework')"
  />
  <template v-else-if="!loading">
    <NotFoundLayout v-if="competencyFramework == null">
      <p>Competency framework not found.</p>
    </NotFoundLayout>
    <template v-else>
      <UiTitle is="h1" class="text-xl mb-3">
        {{ competencyFramework.title }}
      </UiTitle>
      <ManagementLayout :actions="actions">
        <RootCompetencyList
          :framework-id="frameworkId"
          :show-reorder-controls="showReorderCompetenciesControls"
        />
      </ManagementLayout>
    </template>
  </template>
</template>
