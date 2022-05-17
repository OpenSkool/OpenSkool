<script lang="ts" setup>
const DESKTOP_MIN_WIDTH = 760;

const isSideNavOpened = ref<boolean>(window.innerWidth > DESKTOP_MIN_WIDTH);
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
  <div class="flex gap-5">
    <div class="space-y-4 p-5">
      <Transition
        enter-active-class="transition ease-in-out duration-200 transform"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition ease-in-out duration-200 transform"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <UiMainNav v-if="isSideNavOpened">
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
      </Transition>
      <LanguageSelect class="w-full" />
    </div>
    <div class="container mx-auto p-5">
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
