<script lang="ts" setup>
import { MainMenuDocument } from '~/codegen/graphql';
import { useGlobalStore } from '~/domain/global/store';

import type { MenuState } from './use-menu-state';

defineProps<{
  state: MenuState;
}>();

const ability = useAppAbility();
const globalStore = useGlobalStore();

gql`
  query MainMenu {
    myInternshipInstances {
      id
      internship {
        id
        course {
          name
        }
      }
    }
  }
`;

const { loading, onError, result } = useQuery(MainMenuDocument, null, {
  enabled: ability.can('read', 'InternshipInstance'),
});
onError(globalStore.handleFatalApolloError);

const internshipInstances = computed(() =>
  result.value ? result.value.myInternshipInstances : [],
);
</script>

<template>
  <div class="relative">
    <Transition
      enter-active-class="absolute transition transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="absolute transition transform"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <UiMainNav
        v-if="!loading && state.opened"
        class="bg-white"
        :class="{
          'fixed z-10 w-screen h-screen': state.opened && state.overlay,
        }"
      >
        <header class="-mb-5">
          <RouterLink
            class="rounded-md flex gap-3 items-center justify-center focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-primary-700) "
            to="/"
          >
            <img
              :alt="$t('global.mainMenu.logoAlt')"
              class="my-2 inline-block"
              src="/logo.svg"
            />
            <div
              v-t="'global.mainMenu.title'"
              class="font-normal text-xl text-primary-400"
            />
          </RouterLink>
        </header>
        <UiMainNavSection v-if="internshipInstances.length > 0">
          <UiMainNavHeader>
            {{ $t('global.mainMenu.internshipsHeading') }}
          </UiMainNavHeader>
          <UiMainNavLink
            v-for="instance of internshipInstances"
            :key="instance.id"
            :to="`/my-internships/${instance.id}`"
          >
            {{ instance.internship.course.name }}
          </UiMainNavLink>
        </UiMainNavSection>
        <UiMainNavSection>
          <UiMainNavHeader>
            {{ $t('global.mainMenu.management.heading') }}
          </UiMainNavHeader>
          <UiMainNavLink to="/manage/competencies">
            {{ $t('global.mainMenu.management.competencies') }}
          </UiMainNavLink>
        </UiMainNavSection>
        <UiMainNavSection>
          <UiMainNavHeader>Demo</UiMainNavHeader>
          <UiMainNavLink to="/demo/forms">Forms</UiMainNavLink>
          <UiMainNavLink to="/demo/ui">UI</UiMainNavLink>
        </UiMainNavSection>
      </UiMainNav>
    </Transition>
  </div>
</template>

<style scoped>
header img {
  max-height: 2em;
}
</style>
