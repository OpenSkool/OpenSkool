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
        dateFrom
        dateTo
      }
    }
    internshipPosition(id: $positionId) {
      id
      mentors {
        id
        avatarUrl
        name
      }
      organisation {
        imageUrl
        name
      }
      summary
      workplace {
        plainAddress
      }
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
    <article v-else class="space-y-5">
      <UiTitle is="h1" class="text-xl">
        {{
          $t('internships.internshipPosition.detail.heading', {
            courseName: internshipInstance.internship.course.name,
          })
        }}
      </UiTitle>
      <UiCard>
        <img
          v-if="internshipPosition.organisation"
          class="bg-light-500 organisation-image"
          :src="internshipPosition.organisation.imageUrl"
        />
        <div class="p-5">
          <UiSubtitle is="h2" class="mb-5">
            {{ $t('internships.internshipPosition.section.summary.heading') }}
          </UiSubtitle>
          <p class="max-w-65ch">{{ internshipPosition.summary }}</p>
        </div>
      </UiCard>
      <UiCard class="space-y-5 p-5">
        <UiSubtitle is="h2" class="mb-5">Details</UiSubtitle>
        <dl class="gap-5 md:grid">
          <template v-if="internshipPosition.organisation">
            <dt>
              {{
                $t(
                  'internships.internshipPosition.section.details.term.organisation',
                )
              }}
            </dt>
            <dd>{{ internshipPosition.organisation.name }}</dd>
          </template>
          <template v-if="internshipPosition.workplace">
            <dt>
              {{
                $t(
                  'internships.internshipPosition.section.details.term.location',
                )
              }}
            </dt>
            <dd>{{ internshipPosition.workplace.plainAddress }}</dd>
          </template>
          <dt>
            {{
              $t('internships.internshipPosition.section.details.term.period')
            }}
          </dt>
          <dd>
            {{
              new Intl.DateTimeFormat($i18n.locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }).formatRange(
                new Date(internshipInstance.internship.dateFrom),
                new Date(internshipInstance.internship.dateTo),
              )
            }}
          </dd>
        </dl>
      </UiCard>
      <UiCard v-if="internshipPosition.mentors.length > 0" class="p-5">
        <UiSubtitle is="h2" class="mb-5">
          {{ $t('internships.internshipPosition.section.contact.heading') }}
        </UiSubtitle>
        <ul class="space-y-3">
          <li
            v-for="mentor of internshipPosition.mentors"
            :key="mentor.id"
            class="flex gap-5 items-center"
          >
            <img
              class="rounded-full w-12 aspect-square"
              :src="mentor.avatarUrl"
            />
            <div>
              <h3 class="font-semibold">
                {{ mentor.name }}
              </h3>
              <div v-t="'internships.roles.mentor'" />
            </div>
          </li>
        </ul>
      </UiCard>
    </article>
  </template>
</template>

<style scoped>
.organisation-image {
  width: 640px;
  aspect-ratio: 16 / 9;
}
dl {
  grid-template-columns: max-content 1fr;
}
dt {
  @apply font-semibold;
}
</style>
