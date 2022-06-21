<script lang="ts" setup>
import { ManageCompetencyFrameworkListDocument } from '~/codegen/graphql';
import { useGlobalStore } from '~/domain/global';

const globalStore = useGlobalStore();

gql`
  query ManageCompetencyFrameworkList {
    allCompetencyFrameworks {
      id
      title
    }
  }
`;

const { loading, onError, result } = useQuery(
  ManageCompetencyFrameworkListDocument,
);
onError(globalStore.handleFatalApolloError);

const frameworks = computed(() => result.value?.allCompetencyFrameworks);

const ability = useAppAbility();
</script>

<template>
  <template v-if="!loading && frameworks != null">
    <UiEmptyCard v-if="frameworks.length === 0">
      <p>{{ $t('management.competencyFramework.list.emptyDescription') }}</p>
      <UiButtonRouterLink
        v-if="ability.can('create', 'CompetencyFramework')"
        class="my-5"
        to="/manage/competencies/create-framework"
      >
        {{ $t('management.competencyFramework.action.create') }}
      </UiButtonRouterLink>
    </UiEmptyCard>
    <UiOrderedList v-else>
      <UiOrderedListItem
        v-for="framework of frameworks"
        :key="framework.id"
        :link-to="`/manage/competencies/${framework.id}`"
      >
        {{ framework.title }}
      </UiOrderedListItem>
    </UiOrderedList>
  </template>
</template>
