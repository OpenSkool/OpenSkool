<script lang="ts" setup>
import { GetFrameworkRootCompetenciesDocument } from '~/codegen/graphql';
import { ManagementLayout } from '~/domain/global';
import { ActionItem } from '~/types';

import CompetencyList from './competency-list.vue';

const props = defineProps<{
  frameworkId: string;
}>();

const ability = useAppAbility();
const showArrows = ref(false);
const { t } = useI18n();

gql`
  query getFrameworkRootCompetencies($id: ID!) {
    competencyFramework(id: $id) {
      ... on QueryCompetencyFrameworkSuccess {
        data {
          id
          title
          competencies {
            id
            title
          }
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { result, error, loading } = useQuery(
  GetFrameworkRootCompetenciesDocument,
  () => ({ id: props.frameworkId }),
  { fetchPolicy: 'network-only' },
);

const competencyFramework = computed(() =>
  result.value?.competencyFramework?.__typename ===
  'QueryCompetencyFrameworkSuccess'
    ? result.value.competencyFramework.data
    : null,
);
function toggleReorderArrows(): void {
  showArrows.value = !showArrows.value;
}
const actions: ActionItem[] = [
  {
    action: `/manage/competencies/${props.frameworkId}/create-competency`,
    icon: 'ri-add-line',
    hasPermission: ability.can('create', 'Competency'),
    title: t('competencies.route.id.index.action.new'),
  },
  {
    action: toggleReorderArrows,
    icon: 'ri-arrow-up-down-line',
    hasPermission: ability.can('update', 'Competency'),
    title: t('competencies.route.id.index.action.sort'),
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
  <template v-else-if="competencyFramework == null">
    <p>Not found</p>
  </template>
  <template v-else>
    <UiBreadcrumb>
      <UiBreadcrumbItem link-to="/manage/competencies">
        <span v-t="'frameworks.route.index.heading'" />
      </UiBreadcrumbItem>
    </UiBreadcrumb>
    <UiTitle is="h1" class="text-xl mb-3">
      {{ competencyFramework.title }}
    </UiTitle>
    <ManagementLayout
      :actions="actions"
      :actions-label="t('frameworks.route.id.index.actionLabel')"
    >
      <CompetencyList
        v-if="competencyFramework.competencies.length > 0"
        :framework-id="frameworkId"
        :competencies="competencyFramework.competencies"
        :refetch-queries="['getFrameworkRootCompetencies']"
        :show-arrows="showArrows"
      />
      <UiEmptyCard v-else>
        <p v-t="'frameworks.route.id.index.notFound'" />
        <UiButtonRouterLink
          v-if="ability.can('create', 'Competency')"
          v-t="'frameworks.route.id.index.action.new'"
          class="my-5"
          :to="`/manage/competencies/${competencyFramework.id}/create-competency`"
        />
      </UiEmptyCard>
    </ManagementLayout>
  </template>
</template>
