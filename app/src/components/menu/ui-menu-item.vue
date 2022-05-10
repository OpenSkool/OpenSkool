<template>
  <MenuItem v-slot="{ active }" as="div">
    <slot v-bind="{ active }" />
  </MenuItem>
</template>
