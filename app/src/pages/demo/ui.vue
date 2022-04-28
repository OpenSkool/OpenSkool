<script lang="ts" setup>
const isModalOpen = ref(false);

interface Education {
  id: number;
  name: string;
}

const educations: Education[] = [
  { id: 1, name: 'Informatics' },
  { id: 2, name: 'Chemistry' },
  { id: 3, name: 'Medicine' },
];

const selectedEducation = ref<Education>(educations[0] as Education);

const isProjectAwesome = ref<boolean>(true);
</script>

<template>
  <div class="flex gap-10 flex-col items-start">
    <div>
      <h2 class="text-xl mb-3">Buttons</h2>
      <div class="flex gap-3">
        <button class="btn btn-primary text-base">Button</button>
        <ui-icon-button label="Bug">
          <ri-edit-2-fill />
        </ui-icon-button>
      </div>
    </div>
    <div>
      <h2 class="text-xl mb-3">Dialog</h2>
      <button
        class="btn btn-primary text-base"
        type="button"
        @click="isModalOpen = true"
      >
        Open dialog
      </button>
      <ui-dialog :open="isModalOpen" @close="isModalOpen = false">
        <template #title>
          <div class="mb-3 text-xl">Payment successful</div>
        </template>
        <p class="text-base text-gray-500">
          Your payment has been successfully submitted. We’ve sent you an email
          with all of the details of your order.
        </p>
        <div class="mt-4">
          <button
            class="btn btn-primary text-base"
            type="button"
            @click="isModalOpen = false"
          >
            Got it, thanks!
          </button>
        </div>
      </ui-dialog>
    </div>
    <div>
      <h2 class="text-xl mb-3">Listbox (select)</h2>
      <ui-listbox
        v-model="selectedEducation"
        :selected-label="selectedEducation?.name"
      >
        <ui-listbox-option
          v-for="education in educations"
          :key="education.id"
          :value="education"
        >
          {{ education.name }}
        </ui-listbox-option>
      </ui-listbox>
    </div>
    <div>
      <h2 class="text-xl mb-3">Menu</h2>
      <ui-menu label="Options">
        <ui-menu-item v-slot="{ active }">
          <ui-menu-item-button v-bind="{ active }">
            <ri-pencil-fill
              aria-hidden="true"
              :class="[active ? 'text-white' : 'text-primary1-400']"
            />
            Edit
          </ui-menu-item-button>
        </ui-menu-item>
        <ui-menu-item v-slot="{ active }">
          <ui-menu-item-button
            v-bind="{ active }"
            :class="active ? 'bg-red-500 text-white' : 'text-gray-900'"
          >
            <ri-delete-bin-fill
              aria-hidden="true"
              :class="[active ? 'text-white' : 'text-primary1-400']"
            />
            Delete
          </ui-menu-item-button>
        </ui-menu-item>
      </ui-menu>
    </div>
    <div>
      <h2 class="text-xl mb-3">Switch</h2>
      <ui-switch v-model="isProjectAwesome" label="Is this project awesome?" />
    </div>
  </div>
</template>
