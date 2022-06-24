<script lang="ts" setup>
import { AvailablePositionsDocument } from '~/codegen/graphql';
import { useGlobalStore } from '~/domain/global/store';
import { useHead } from '~/i18n';

const props = defineProps<{
  internshipInstanceId: string; // route param
}>();

gql`
  query availablePositions($id: ID!) {
    myInternshipInstance(id: $id) {
      ... on QueryMyInternshipInstanceSuccess {
        data {
          internship {
            course {
              name
            }
            availablePositions {
              id
              summary
              organisation {
                name
              }
            }
          }
        }
      }
      ...BaseErrorFields
    }
  }
`;
const globalStore = useGlobalStore();

const { loading, onError, result } = useQuery(
  AvailablePositionsDocument,
  () => ({
    id: props.internshipInstanceId,
  }),
  { fetchPolicy: 'cache-first' },
);
onError(globalStore.handleFatalApolloError);

const internshipInstance = computed(() =>
  result.value?.myInternshipInstance?.__typename ===
  'QueryMyInternshipInstanceSuccess'
    ? result.value.myInternshipInstance.data.internship
    : null,
);

useHead(() => ({
  title: internshipInstance.value?.course.name,
}));
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem link-to="/manage/competencies">
      {{ $t('global.mainMenu.internshipsHeading') }}
    </UiBreadcrumbItem>
  </UiBreadcrumb>
  <UiTitle is="h1" class="text-xl mb-3">My Internship</UiTitle>
  <template v-if="!loading">
    <ul class="grid gap-5">
      <li
        v-for="position in internshipInstance?.availablePositions"
        :key="position.id"
      >
        <UiCard class="p-5">
          <UiTitle is="h2">{{ position.organisation.name }}</UiTitle>
          <p>{{ position.summary }}</p>
        </UiCard>
      </li>
    </ul>
  </template>
</template>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fill, minmax(30ch, 1fr));
}
</style>
