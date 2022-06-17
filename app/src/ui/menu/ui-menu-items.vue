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
      class="divide-y bg-white rounded-md min-w-xs divide-gray-100 shadow-lg ring-black mt-1 p-1 origin-top-right right-0 ring-1 ring-opacity-5 z-5 absolute focus:outline-none"
    >
      <slot v-bind="{ active, disabled }" />
    </MenuItems>
  </Transition>
</template>
