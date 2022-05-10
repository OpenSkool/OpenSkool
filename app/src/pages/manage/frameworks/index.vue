<script lang="ts" setup>
import { GetAllCompetencyFrameworksDocument } from '~/codegen/graphql';
import { useI18nStore } from '~/i18n';

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/frameworks.*.yaml'));

const ability = useAppAbility();

gql`
  query GetAllCompetencyFrameworks {
    allCompetencyFrameworks {
      id
      title
    }
  }
`;

const { result } = useQuery(GetAllCompetencyFrameworksDocument);

const frameworks = useResult(result);
</script>

<template>
  <UiTitle
    is="h2"
    v-t="'frameworks.route.index.heading'"
    class="text-xl mb-3"
  />
  <UiButtonRouterLink
    v-if="ability.can('create', 'CompetencyFramework')"
    v-t="'frameworks.route.index.action.create'"
    class="my-5"
    to="/manage/frameworks/create-framework"
  />
  <ol class="list-decimal">
    <li v-for="framework of frameworks" :key="framework.id">
      <RouterLink :to="`/manage/frameworks/${framework.id}`">
        {{ framework.title }}
      </RouterLink>
    </li>
  </ol>
</template>
