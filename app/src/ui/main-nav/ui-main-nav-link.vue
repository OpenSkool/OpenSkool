<template>
  <RouterLink
    active-class="bg-secondary-200/50 font-medium"
    :class="[
      'block px-3 py-2 rounded-md hover:bg-gray-300/50',
      'focus:outline-none focus-visible:(ring-2 ring-offset-2 ring-secondary-400)',
    ]"
  >
    <slot />
  </RouterLink>
</template>
