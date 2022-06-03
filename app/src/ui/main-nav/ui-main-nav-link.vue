<template>
  <RouterLink
    active-class="bg-primary-200/50 font-medium"
    :class="[
      'block px-3 py-2 rounded-md hover:bg-gray-200',
      'focus:outline-none focus-visible:(ring-2 ring-primary-700)',
    ]"
  >
    <slot />
  </RouterLink>
</template>
