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
      class="flex flex-col flex-col items-end"
    >
      <slot v-bind="{ active, disabled }" />
    </MenuItems>
  </Transition>
</template>
