<script lang="ts" setup>
import { useGlobalQueryLoading } from '@vue/apollo-composable';

const loading = useGlobalQueryLoading();
</script>

<template>
  <div class="bg-white">
    <div class="flex items-center justify-end p-3">
      <div class="flex gap-8 items-center">
        <LanguageSelect />
        <UserMenu />
      </div>
    </div>
  </div>
  <div>
    <div class="absolute -ml-12 mt-1 left-1/2 top-1/2">
      <TransitionRoot
        :show="loading"
        enter="duration-100 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="delay-300 duration-100 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <RiLoaderFill class="text-xl text-tertiary-300 spin" />
      </TransitionRoot>
    </div>
    <div class="flex gap-5">
      <UiMainNav>
        <UiMainNavSection name="Home">
          <UiMainNavLink to="/">Home</UiMainNavLink>
        </UiMainNavSection>
        <UiMainNavSection name="Demo">
          <UiMainNavLink to="/demo/forms">Forms</UiMainNavLink>
          <UiMainNavLink to="/demo/ui">UI</UiMainNavLink>
        </UiMainNavSection>
        <UiMainNavSection name="Frameworks">
          <UiMainNavLink to="/manage/frameworks"
            >Manage frameworks</UiMainNavLink
          >
        </UiMainNavSection>
      </UiMainNav>
      <div class="container mx-auto px-5 mt-5">
        <Suspense>
          <RouterView />
        </Suspense>
      </div>
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
