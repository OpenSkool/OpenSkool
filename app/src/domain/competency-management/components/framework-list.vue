<script lang="ts" setup>
import { GetAllCompetencyFrameworksDocument } from '~/codegen/graphql';

gql`
  query GetAllCompetencyFrameworks {
    allCompetencyFrameworks {
      id
      title
    }
  }
`;

const { error, loading, result } = useQuery(GetAllCompetencyFrameworksDocument);

const frameworks = computed(() =>
  result.value ? result.value.allCompetencyFrameworks : null,
);

const ability = useAppAbility();
</script>

<template>
  <template v-if="error">
    <p>Something went wrong</p>
  </template>
  <template v-else-if="loading">
    <p>Loading</p>
  </template>
  <template v-else-if="frameworks == null">
    <p>Not found</p>
  </template>
  <template v-else>
    <UiOrderedList v-if="frameworks.length > 0">
      <UiOrderedListItem
        v-for="framework of frameworks"
        :key="framework.id"
        :link-to="`/manage/frameworks/${framework.id}`"
      >
        {{ framework.title }}
      </UiOrderedListItem>
    </UiOrderedList>
    <EmptyCard v-else>
      <p v-t="'frameworks.route.index.notFound'" />
      <UiButtonRouterLink
        v-if="ability.can('create', 'CompetencyFramework')"
        v-t="'frameworks.route.index.action.create'"
        class="my-5"
        to="/manage/frameworks/create-framework"
      />
    </EmptyCard>
  </template>
</template>
