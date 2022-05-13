<template>
  <label class="flex items-center gap-2">
    <div class="relative w-5 h-5">
      <input
        class="center appearance-none w-5 h-5 bg-white rounded-sm checked:bg-secondary-300"
        type="checkbox"
        v-bind="$attrs"
      />
      <RiCheckLine class="center check hidden text-white font-bold" />
    </div>
    <slot />
  </label>
</template>

<style scoped>
input:checked + .check {
  display: block;
}
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
