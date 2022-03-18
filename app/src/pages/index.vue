<script lang="ts" setup>
const isModalOpen = ref(false);
</script>

<template>
  <div class="container mx-auto">
    <div class="text-center">
      <hello-world msg="Hello Vue 3 + TypeScript + Vite" />
    </div>

    <div class="mt-5 flex items-center justify-center">
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        @click="isModalOpen = true"
      >
        Open dialog
      </button>
    </div>
    <ui-dialog :open="isModalOpen" @close="isModalOpen = false">
      <template #title>Payment successful</template>
      <p class="text-sm text-gray-500">
        Your payment has been successfully submitted. We’ve sent you an email
        with all of the details of your order.
      </p>
      <div class="mt-4">
        <button
          type="button"
          class="inline-flex justify-center px-4 py-2 text-sm font-medium text-amber-900 bg-amber-100 border border-transparent rounded-md hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500"
          @click="isModalOpen = false"
        >
          Got it, thanks!
        </button>
      </div>
    </ui-dialog>
  </div>
</template>
