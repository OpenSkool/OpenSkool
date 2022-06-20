<script lang="ts" setup>
import { AvailablePositionsDocument } from '~/codegen/graphql';
import { useGlobalStore } from '~/domain/global/store';

const props = defineProps<{
  internshipInstanceId: string; // route param
}>();

gql`
  query availablePositions($id: ID!) {
    myInternshipInstance(id: $id) {
      ... on QueryMyInternshipInstanceSuccess {
        data {
          internship {
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

const { result, onError } = useQuery(
  AvailablePositionsDocument,
  () => ({
    id: props.internshipInstanceId,
  }),
  { fetchPolicy: 'cache-first' },
);

onError(globalStore.handleFatalApolloError);

const availablePositions = computed(() =>
  result.value?.myInternshipInstance?.__typename ===
  'QueryMyInternshipInstanceSuccess'
    ? result.value.myInternshipInstance.data.internship.availablePositions
    : [],
);
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem link-to="/manage/competencies">
      {{ $t('global.mainMenu.internships') }}
    </UiBreadcrumbItem>
  </UiBreadcrumb>
  <UiTitle is="h1" class="text-xl mb-3">My Internship</UiTitle>
  <ul class="flex flex-wrap gap-5">
    <li
      v-for="position in availablePositions"
      :key="position.id"
      class="bg-gray-200 p-5 w-64"
    >
      <UiTitle is="h2">{{ position.organisation.name }}</UiTitle>
      <p>{{ position.summary }}</p>
    </li>
  </ul>
</template>
