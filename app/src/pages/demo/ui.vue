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
      <ui-title is="h2" class="text-xl mb-3">Title</ui-title>
      <ui-subtitle is="h3" class="mb-3">Subtitle</ui-subtitle>
      <ui-title is="h2" class="text-xl mb-3">Buttons</ui-title>
      <div class="flex flex-col gap-3">
        <div class="flex gap-3">
          <ui-button color="primary">Button</ui-button>
          <ui-button color="primary" disabled>Button</ui-button>
          <ui-button color="primary" outline>Button</ui-button>
          <ui-button color="primary" disabled outline>Button</ui-button>
        </div>
        <div class="flex gap-3">
          <ui-button color="secondary">Button</ui-button>
          <ui-button color="secondary" disabled>Button</ui-button>
          <ui-button color="secondary" outline>Button</ui-button>
          <ui-button color="secondary" disabled outline>Button</ui-button>
        </div>
        <div class="flex gap-3">
          <ui-button color="tertiary">Button</ui-button>
          <ui-button color="tertiary" disabled>Button</ui-button>
          <ui-button color="tertiary" outline>Button</ui-button>
          <ui-button color="tertiary" disabled outline>Button</ui-button>
        </div>
        <div class="flex gap-3">
          <ui-button color="caution">Button</ui-button>
          <ui-button color="caution" disabled>Button</ui-button>
          <ui-button color="caution" outline>Button</ui-button>
          <ui-button color="caution" disabled outline>Button</ui-button>
        </div>
        <div class="flex gap-3">
          <ui-button color="danger">Button</ui-button>
          <ui-button color="danger" disabled>Button</ui-button>
          <ui-button color="danger" outline>Button</ui-button>
          <ui-button color="danger" disabled outline>Button</ui-button>
        </div>
        <div class="flex gap-3">
          <ui-button color="success">Button</ui-button>
          <ui-button color="success" disabled>Button</ui-button>
          <ui-button color="success" outline>Button</ui-button>
          <ui-button color="success" disabled outline>Button</ui-button>
        </div>
        <div class="flex gap-3">
          <ui-button color="primary" size="sm">Button</ui-button>
          <ui-button color="secondary" size="sm">Button</ui-button>
          <ui-button color="tertiary" size="sm">Button</ui-button>
          <ui-button color="caution" size="sm">Button</ui-button>
          <ui-button color="danger" size="sm">Button</ui-button>
          <ui-button color="success" size="sm">Button</ui-button>
        </div>
        <div>
          <ui-icon-button label="Edit">
            <ri-edit-2-fill />
          </ui-icon-button>
        </div>
      </div>
    </div>
    <div>
      <ui-title is="h2" class="text-xl mb-3">Dialog</ui-title>
      <ui-button @click="isModalOpen = true">Open dialog</ui-button>
      <ui-dialog :open="isModalOpen" @close="isModalOpen = false">
        <template #title>
          <div class="mb-3 text-xl">Payment successful</div>
        </template>
        <p class="text-base text-gray-500">
          Your payment has been successfully submitted. We’ve sent you an email
          with all of the details of your order.
        </p>
        <div class="mt-4">
          <ui-button @click="isModalOpen = false">Got it, thanks!</ui-button>
        </div>
      </ui-dialog>
    </div>
    <div>
      <ui-title is="h2" class="text-xl mb-3">Listbox (select)</ui-title>
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
      <ui-title is="h2" class="text-xl mb-3">Menu</ui-title>
      <ui-menu label="Options">
        <ui-menu-item v-slot="{ active }">
          <ui-menu-item-button v-bind="{ active }">
            <ri-pencil-fill aria-hidden="true" class="text-secondary-400" />
            Edit
          </ui-menu-item-button>
        </ui-menu-item>
        <ui-menu-item v-slot="{ active }">
          <ui-menu-item-button v-bind="{ active }" class="">
            <ri-delete-bin-fill aria-hidden="true" class="text-danger-400" />
            Delete
          </ui-menu-item-button>
        </ui-menu-item>
      </ui-menu>
    </div>
    <div>
      <ui-title is="h2" class="text-xl mb-3">Switch</ui-title>
      <ui-switch v-model="isProjectAwesome" label="Is this project awesome?" />
    </div>
  </div>
</template>
