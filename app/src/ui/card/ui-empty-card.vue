<template>
  <div
    class="flex justify-center px-5 text-lg text-center bg-white gap-10 rounded-md py-15"
  >
    <RiAlarmWarningLine aria-hidden class="hidden md:block" />
    <div class="space-y-5">
      <slot />
    </div>
    <RiAlarmWarningLine aria-hidden class="hidden md:block" />
  </div>
</template>
