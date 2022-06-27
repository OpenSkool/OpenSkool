<script lang="ts" setup>
import { MyInternshipsRouteDocument } from '~/codegen/graphql';
import NotFoundLayout from '~/domain/global/components/not-found-layout.vue';
import { useGlobalStore } from '~/domain/global/store';
import { useHead } from '~/i18n';

const props = defineProps<{
  internshipInstanceId: string; // route param
}>();

gql`
  query MyInternshipsRoute($id: ID!) {
    myInternshipInstance(id: $id) {
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
const globalStore = useGlobalStore();

const { loading, onError, result } = useQuery(
  MyInternshipsRouteDocument,
  () => ({
    id: props.internshipInstanceId,
  }),
  { fetchPolicy: 'cache-first' },
);
onError(globalStore.handleFatalApolloError);

const myInternshipInstance = computed(() => result.value?.myInternshipInstance);

useHead(({ t }) => ({
  title: t('internships.internshipInstance.detail.heading', {
    courseName: myInternshipInstance.value?.internship.course.name,
  }),
}));
</script>

<template>
  <UiBreadcrumb>
    <UiBreadcrumbItem link-to="/manage/competencies">
      {{ $t('global.mainMenu.internshipsHeading') }}
    </UiBreadcrumbItem>
  </UiBreadcrumb>
  <template v-if="!loading">
    <NotFoundLayout v-if="myInternshipInstance == null">
      <p v-t="'internships.internshipInstance.error.notFound'" />
    </NotFoundLayout>
    <template v-else>
      <UiTitle is="h1" class="text-xl mb-3">
        {{
          $t('internships.internshipInstance.detail.heading', {
            courseName: myInternshipInstance.internship.course.name,
          })
        }}
      </UiTitle>
      <ul class="grid gap-5">
        <li
          v-for="position in myInternshipInstance.internship.availablePositions"
          :key="position.id"
        >
          <UiCard>
            <img
              class="bg-light-500"
              loading="lazy"
              :src="position.organisation.imageUrl"
            />
            <div class="p-5">
              <UiTitle is="h2" class="text-lg">
                {{ position.organisation.name }}
              </UiTitle>
              <p>{{ position.summary }}</p>
            </div>
          </UiCard>
        </li>
      </ul>
    </template>
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
