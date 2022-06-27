<script lang="ts" setup>
import { InternshipInstancePositionDetailQueryDocument } from '~/codegen/graphql';
import { NotFoundLayout, useGlobalStore } from '~/domain/global';

const props = defineProps<{
  instanceId: string; // route param
  positionId: string; // route param
}>();

const globalStore = useGlobalStore();

gql`
  query InternshipInstancePositionDetailQuery(
    $instanceId: ID!
    $positionId: ID!
  ) {
    internshipInstance(id: $instanceId) {
      internship {
        course {
          name
        }
      }
    }
    internshipPosition(id: $positionId) {
      id
      organisation {
        imageUrl
        name
      }
      summary
    }
  }
`;

const { loading, onError, result } = useQuery(
  InternshipInstancePositionDetailQueryDocument,
  () => props,
  { fetchPolicy: 'cache-first' },
);
onError(globalStore.handleFatalApolloError);

const internshipInstance = computed(() => result.value?.internshipInstance);
const internshipPosition = computed(() => result.value?.internshipPosition);
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem>
      {{ $t('global.mainMenu.internshipsHeading') }}
    </UiBreadcrumbItem>
    <UiBreadcrumbItem
      v-if="internshipInstance"
      :link-to="`/my-internships/${instanceId}`"
    >
      {{
        $t('internships.internshipInstance.detail.heading', {
          courseName: internshipInstance.internship.course.name,
        })
      }}
    </UiBreadcrumbItem>
  </UiBreadcrumb>
  <template v-if="!loading">
    <NotFoundLayout
      v-if="internshipInstance == null || internshipPosition == null"
    >
      <p v-t="'internships.internshipPosition.error.notFound'" />
    </NotFoundLayout>
    <template v-else>
      <UiTitle is="h1" class="text-xl mb-3">
        {{
          $t('internships.internshipPosition.detail.heading', {
            courseName: internshipInstance.internship.course.name,
            organisationName: internshipPosition.organisation.name,
          })
        }}
      </UiTitle>
      <UiCard class="pt-3">
        <img
          class="bg-light-500"
          :src="internshipPosition.organisation.imageUrl"
        />
        <div class="space-y-3 p-5">
          <UiSubtitle is="h2">Summary</UiSubtitle>
          <p>{{ internshipPosition.summary }}</p>
        </div>
      </UiCard>
    </template>
  </template>
</template>

<style scoped>
img {
  width: 640px;
  aspect-ratio: 16 / 9;
}
</style>
