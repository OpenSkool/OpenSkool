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
      <UiTitle is="h2" class="text-xl mb-3">Title</UiTitle>
      <UiSubtitle is="h3" class="mb-3">Subtitle</UiSubtitle>
      <UiTitle is="h2" class="text-xl mb-3">Buttons</UiTitle>
      <div class="flex flex-col gap-3">
        <div class="flex gap-3">
          <UiButton color="primary">Button</UiButton>
          <UiButton color="primary" disabled>Button</UiButton>
          <UiButton color="primary" outline>Button</UiButton>
          <UiButton color="primary" disabled outline>Button</UiButton>
        </div>
        <div class="flex gap-3">
          <UiButton color="secondary">Button</UiButton>
          <UiButton color="secondary" disabled>Button</UiButton>
          <UiButton color="secondary" outline>Button</UiButton>
          <UiButton color="secondary" disabled outline>Button</UiButton>
        </div>
        <div class="flex gap-3">
          <UiButton color="tertiary">Button</UiButton>
          <UiButton color="tertiary" disabled>Button</UiButton>
          <UiButton color="tertiary" outline>Button</UiButton>
          <UiButton color="tertiary" disabled outline>Button</UiButton>
        </div>
        <div class="flex gap-3">
          <UiButton color="caution">Button</UiButton>
          <UiButton color="caution" disabled>Button</UiButton>
          <UiButton color="caution" outline>Button</UiButton>
          <UiButton color="caution" disabled outline>Button</UiButton>
        </div>
        <div class="flex gap-3">
          <UiButton color="danger">Button</UiButton>
          <UiButton color="danger" disabled>Button</UiButton>
          <UiButton color="danger" outline>Button</UiButton>
          <UiButton color="danger" disabled outline>Button</UiButton>
        </div>
        <div class="flex gap-3">
          <UiButton color="success">Button</UiButton>
          <UiButton color="success" disabled>Button</UiButton>
          <UiButton color="success" outline>Button</UiButton>
          <UiButton color="success" disabled outline>Button</UiButton>
        </div>
        <div class="flex gap-3">
          <UiButton color="primary" size="sm">Button</UiButton>
          <UiButton color="secondary" size="sm">Button</UiButton>
          <UiButton color="tertiary" size="sm">Button</UiButton>
          <UiButton color="caution" size="sm">Button</UiButton>
          <UiButton color="danger" size="sm">Button</UiButton>
          <UiButton color="success" size="sm">Button</UiButton>
        </div>
        <div>
          <UiIconButton label="Edit">
            <RiEdit2Fill />
          </UiIconButton>
        </div>
      </div>
    </div>
    <div>
      <UiTitle is="h2" class="text-xl mb-3">Dialog</UiTitle>
      <UiButton @click="isModalOpen = true">Open dialog</UiButton>
      <UiDialog :open="isModalOpen" @close="isModalOpen = false">
        <template #title>
          <div class="mb-3 text-xl">Payment successful</div>
        </template>
        <p class="text-base text-gray-500">
          Your payment has been successfully submitted. We’ve sent you an email
          with all of the details of your order.
        </p>
        <div class="mt-4">
          <UiButton @click="isModalOpen = false">Got it, thanks!</UiButton>
        </div>
      </UiDialog>
    </div>
    <div>
      <UiTitle is="h2" class="text-xl mb-3">Listbox (select)</UiTitle>
      <UiListbox
        v-model="selectedEducation"
        :selected-label="selectedEducation?.name"
      >
        <UiListboxOption
          v-for="education in educations"
          :key="education.id"
          :value="education"
        >
          {{ education.name }}
        </UiListboxOption>
      </UiListbox>
    </div>
    <div>
      <UiTitle is="h2" class="text-xl mb-3">Menu</UiTitle>
      <UiMenu label="Options">
        <UiMenuItem v-slot="{ active }">
          <UiMenuItemButton v-bind="{ active }">
            <RiPencilFill aria-hidden="true" class="text-secondary-400" />
            Edit
          </UiMenuItemButton>
        </UiMenuItem>
        <UiMenuItem v-slot="{ active }">
          <UiMenuItemButton v-bind="{ active }" class="">
            <RiDeleteBinFill aria-hidden="true" class="text-danger-400" />
            Delete
          </UiMenuItemButton>
        </UiMenuItem>
      </UiMenu>
    </div>
    <div>
      <UiTitle is="h2" class="text-xl mb-3">Switch</UiTitle>
      <UiSwitch v-model="isProjectAwesome" label="Is this project awesome?" />
    </div>
  </div>
</template>
