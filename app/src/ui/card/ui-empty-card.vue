<template>
  <div
    class="flex justify-center gap-10 rounded-md bg-white text-center text-lg px-5 py-15"
  >
    <RiAlarmWarningLine aria-hidden class="hidden md:block" />
    <div class="space-y-5">
      <slot />
    </div>
    <RiAlarmWarningLine aria-hidden class="hidden md:block" />
  </div>
</template>
