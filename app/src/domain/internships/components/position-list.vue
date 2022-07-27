<script lang="ts" setup>
import { InternshipPositionListQueryDocument } from '~/codegen/graphql';
import { useGlobalStore } from '~/domain/global';

const props = defineProps<{
  instanceId: string;
}>();

const globalStore = useGlobalStore();

gql`
  query InternshipPositionListQuery($id: ID!) {
    internshipInstance(id: $id) {
      internship {
        course {
          name
        }
        availablePositions {
          id
          summary
          organisation {
            imageUrl
            name
          }
        }
      }
    }
  }
`;

const { loading, onError, result } = useQuery(
  InternshipPositionListQueryDocument,
  () => ({
    id: props.instanceId,
  }),
  { fetchPolicy: 'cache-first' },
);
onError(globalStore.handleFatalApolloError);

const internshipInstance = computed(() => result.value?.internshipInstance);
</script>

<template>
  <template v-if="!loading">
    <UiNotification v-if="internshipInstance == null" color="danger">
      Something went wrong. No internship instance found.
    </UiNotification>
    <ul v-else class="grid gap-5">
      <li
        v-for="position in internshipInstance.internship.availablePositions"
        :key="position.id"
      >
        <UiCard>
          <img
            v-if="position.organisation"
            class="bg-light-500"
            loading="lazy"
            :src="position.organisation.imageUrl"
          />
          <div class="p-5">
            <UiTitle is="h2" class="text-lg">
              <RouterLink
                class="underline"
                :to="`/my-internships/${instanceId}/positions/${position.id}`"
              >
                {{
                  position.organisation?.name ??
                  $t('internships.internshipInstance.detail.heading', {
                    courseName: internshipInstance.internship.course.name,
                  })
                }}
              </RouterLink>
            </UiTitle>
            <p>{{ position.summary }}</p>
          </div>
        </UiCard>
      </li>
    </ul>
  </template>
</template>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fill, minmax(30ch, 1fr));
}
img {
  aspect-ratio: 16 / 9;
}
</style>
