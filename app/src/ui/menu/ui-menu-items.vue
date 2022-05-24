<template>
  <Transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-75 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <MenuItems
      v-slot="{ active, disabled }"
      as="div"
      :class="[
        'absolute right-0 origin-top-right z-5 min-w-xs mt-1',
        'bg-white rounded-md shadow-lg p-1 divide-y divide-gray-100',
        'focus:outline-none ring-1 ring-black ring-opacity-5',
      ]"
    >
      <slot v-bind="{ active, disabled }" />
    </MenuItems>
  </Transition>
</template>
