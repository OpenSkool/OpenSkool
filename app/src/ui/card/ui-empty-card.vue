<template>
  <UiCard>
    <div class="flex text-center gap-10 justify-center">
      <RiAlarmWarningLine aria-hidden class="hidden md:inline" />
      <div class="space-y-5">
        <slot />
      </div>
      <RiAlarmWarningLine aria-hidden class="hidden md:inline" />
    </div>
  </UiCard>
</template>
