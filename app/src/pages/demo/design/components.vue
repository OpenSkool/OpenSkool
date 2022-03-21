<script lang="ts" setup>
const isModalOpen = ref(false);
</script>

<template>
  <div class="flex gap-10 flex-col items-start">
    <div>
      <h2 class="text-xl mb-3">Buttons</h2>
      <ui-button>Button</ui-button>
    </div>
    <div>
      <h2 class="text-xl mb-3">Dialog</h2>
      <ui-button @click="isModalOpen = true">Open dialog</ui-button>
      <ui-dialog :open="isModalOpen" @close="isModalOpen = false">
        <template #title>Payment successful</template>
        <p class="text-gray-500">
          Your payment has been successfully submitted. We’ve sent you an email
          with all of the details of your order.
        </p>
        <div class="mt-4">
          <ui-button @click="isModalOpen = false">Got it, thanks!</ui-button>
        </div>
      </ui-dialog>
    </div>
  </div>
</template>
