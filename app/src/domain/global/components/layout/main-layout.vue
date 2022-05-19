<script lang="ts" setup>
const DESKTOP_MIN_WIDTH = 768;

const isSideNavOpened = ref<boolean>(windowSizeIsMediumOrBigger());

const transitionClasses = 'transition duration-300 ease-in-out transform';

function windowSizeIsMediumOrBigger(): boolean {
  return window.innerWidth > DESKTOP_MIN_WIDTH;
}

function closeSideNavOnMobile(): void {
  if (!windowSizeIsMediumOrBigger()) {
    isSideNavOpened.value = false;
  }
}
</script>

<template>
  <div class="bg-white">
    <div class="flex items-center justify-between p-3">
      <button
        class="flex items-center focus:outline-none focus-visible:(ring-2 ring-offset-2 rounded-md pr-5 ring-black)"
        @click="isSideNavOpened = !isSideNavOpened"
      >
        <RiMenuLine v-if="!isSideNavOpened" class="mx-3" />
        <RiMenuFoldLine v-if="isSideNavOpened" class="mx-3" />
        <span>Menu</span>
      </button>
      <LoadingSpinner />
      <UserMenu />
    </div>
  </div>

  <div class="flex gap-5 h-screen">
    <div
      :class="[
        isSideNavOpened ? 'translate-x-0' : '-translate-x-full',
        transitionClasses,
      ]"
      class="space-y-4 bg-white p-5"
    >
      <UiMainNav @click="closeSideNavOnMobile">
        <UiMainNavSection name="Home">
          <UiMainNavLink to="/">Home</UiMainNavLink>
        </UiMainNavSection>
        <UiMainNavSection name="Demo">
          <UiMainNavLink to="/demo/forms">Forms</UiMainNavLink>
          <UiMainNavLink to="/demo/ui">UI</UiMainNavLink>
        </UiMainNavSection>
        <UiMainNavSection name="Frameworks">
          <UiMainNavLink to="/manage/frameworks">
            Manage frameworks
          </UiMainNavLink>
        </UiMainNavSection>
      </UiMainNav>
      <LanguageSelect />
    </div>

    <div
      :class="[
        isSideNavOpened ? ' translate-x-0' : '-translate-x-64',
        transitionClasses,
      ]"
      class="container mx-auto p-5"
    >
      <Suspense>
        <RouterView />
      </Suspense>
    </div>
  </div>
</template>

<style scoped>
:global(html, body) {
  @apply antialiased font-sans bg-gray-100;
}

:global(a) {
  @apply text-primary-600;
}

.spin {
  animation: spin 1.25s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
