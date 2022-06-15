<script lang="ts" setup>
import { MainMenuDocument } from '~/codegen/graphql';
import { useGlobalStore } from '~/domain/global/store';

import type { MenuState } from './use-menu-state';

defineProps<{
  state: MenuState;
}>();

const globalStore = useGlobalStore();

gql`
  query MainMenu {
    myInternshipInstances {
      id
      internship {
        name
        courses {
          name
        }
      }
    }
  }
`;

const { loading, onError, result } = useQuery(MainMenuDocument);
onError(globalStore.handleFatalApolloError);

const internshipInstances = computed(() =>
  result.value ? result.value.myInternshipInstances : [],
);
</script>

<template>
  <div v-if="!loading" class="relative">
    <Transition
      enter-active-class="absolute transition transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="absolute transition transform"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <UiMainNav
        v-if="state.opened"
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
              alt="OpenSkool logo backpack line art"
              class="my-2 inline-block"
              src="/logo.svg"
            />
            <div
              v-t="'global.title'"
              class="font-normal text-xl text-primary-400"
            />
          </RouterLink>
        </header>
        <UiMainNavSection>
          <UiMainNavHeader>
            {{ $t('global.mainMenu.managementHeader') }}
          </UiMainNavHeader>
          <UiMainNavLink to="/manage/competencies">
            {{ $t('global.mainMenu.managementLink.competencyFrameworks') }}
          </UiMainNavLink>
        </UiMainNavSection>
        <UiMainNavSection v-if="internshipInstances.length > 0">
          <UiMainNavHeader>
            {{ $t('global.mainMenu.internships') }}
          </UiMainNavHeader>
          <UiMainNavLink
            v-for="internshipInstance of internshipInstances"
            :key="internshipInstance.id"
            :to="`/my-internships/${internshipInstance.id}`"
          >
            {{ internshipInstance.internship.name }}
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
