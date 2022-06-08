<template>
  <Menu v-slot="{ open }" as="div">
    <slot v-bind="{ open }" />
  </Menu>
</template>
