<script lang="ts" setup>
defineProps<{
  label: string;
  classes?: {
    menuButton?: string;
    menuItems?: string;
  };
}>();
</script>

<template>
  <Menu as="div" class="relative inline-block">
    <MenuButton>
      <UiButton :class="classes?.menuButton">
        {{ label }}
        <RiArrowDropDownLine aria-hidden="true" />
      </UiButton>
    </MenuButton>
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
        class="absolute right-0 origin-top-right bg-white rounded-lg shadow-lg p-1 z-5"
        :class="classes?.menuItems"
      >
        <slot v-bind="{ active, disabled }" />
      </MenuItems>
    </Transition>
  </Menu>
</template>
