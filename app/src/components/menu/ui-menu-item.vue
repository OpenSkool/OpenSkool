<template>
  <MenuItem v-slot="{ active, disabled }" as="div">
    <button
      :class="[
        'w-full flex gap-3 items-center px-4 py-3 rounded-md',
        active ? 'bg-primary-200' : 'text-gray-900',
      ]"
    >
      <slot v-bind="{ active, disabled }" />
    </button>
  </MenuItem>
</template>
