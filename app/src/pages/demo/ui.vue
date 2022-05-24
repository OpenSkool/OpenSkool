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
const inputText = ref<string>('');
</script>

<template>
  <div class="space-y-10 mb-50">
    <div>
      <UiTitle is="h2" class="text-xl">Title</UiTitle>
      <UiSubtitle is="h3">Subtitle</UiSubtitle>
    </div>
    <div>
      <UiTitle is="h2" class="text-xl mb-3">Buttons</UiTitle>
      <div class="space-y-3">
        <div class="space-x-3">
          <UiButton color="primary">Button</UiButton>
          <UiButton color="primary" disabled>Button</UiButton>
          <UiButton color="primary" outline>Button</UiButton>
          <UiButton color="primary" disabled outline>Button</UiButton>
        </div>
        <div class="space-x-3">
          <UiButton color="secondary">Button</UiButton>
          <UiButton color="secondary" disabled>Button</UiButton>
          <UiButton color="secondary" outline>Button</UiButton>
          <UiButton color="secondary" disabled outline>Button</UiButton>
        </div>
        <div class="space-x-3">
          <UiButton color="tertiary">Button</UiButton>
          <UiButton color="tertiary" disabled>Button</UiButton>
          <UiButton color="tertiary" outline>Button</UiButton>
          <UiButton color="tertiary" disabled outline>Button</UiButton>
        </div>
        <div class="space-x-3">
          <UiButton color="caution">Button</UiButton>
          <UiButton color="caution" disabled>Button</UiButton>
          <UiButton color="caution" outline>Button</UiButton>
          <UiButton color="caution" disabled outline>Button</UiButton>
        </div>
        <div class="space-x-3">
          <UiButton color="danger">Button</UiButton>
          <UiButton color="danger" disabled>Button</UiButton>
          <UiButton color="danger" outline>Button</UiButton>
          <UiButton color="danger" disabled outline>Button</UiButton>
        </div>
        <div class="space-x-3">
          <UiButton color="success">Button</UiButton>
          <UiButton color="success" disabled>Button</UiButton>
          <UiButton color="success" outline>Button</UiButton>
          <UiButton color="success" disabled outline>Button</UiButton>
        </div>
        <div class="space-x-3">
          <UiButton color="primary" size="sm">Button</UiButton>
          <UiButton color="secondary" size="sm">Button</UiButton>
          <UiButton color="tertiary" size="sm">Button</UiButton>
          <UiButton color="caution" size="sm">Button</UiButton>
          <UiButton color="danger" size="sm">Button</UiButton>
          <UiButton color="success" size="sm">Button</UiButton>
        </div>
        <div>
          <UiIconButton label="Edit">
            <RiEdit2Line />
          </UiIconButton>
        </div>
      </div>
    </div>
    <div>
      <UiTitle is="h2" class="text-xl mb-3">Dialog</UiTitle>
      <UiButton @click="isModalOpen = true">Open dialog</UiButton>
      <UiDialog :open="isModalOpen" @close="isModalOpen = false">
        <UiDialogTitle>Payment successful</UiDialogTitle>
        <UiDialogDescription>
          Your payment has been successfully submitted. We’ve sent you an email
          with all of the details of your order.
        </UiDialogDescription>
        <UiDialogButtons>
          <UiButton @click="isModalOpen = false">Got it, thanks!</UiButton>
        </UiDialogButtons>
      </UiDialog>
    </div>
    <div class="space-y-3">
      <UiTitle is="h2" class="text-xl">Inputs</UiTitle>
      <UiInputText v-model="inputText" placeholder="Hello World!" />
      <UiSelect
        v-model="selectedEducation"
        :selected-label="selectedEducation?.name"
      >
        <UiSelectOption
          v-for="education in educations"
          :key="education.id"
          :value="education"
          :disabled="education.id === 3"
        >
          {{ education.name }}
        </UiSelectOption>
      </UiSelect>
      <UiSwitch v-model="isProjectAwesome" label="Is this project awesome?" />
      <UiCheckbox id="checkbox1">Unchecked</UiCheckbox>
      <UiCheckbox id="checkbox2" checked>Checked</UiCheckbox>
      <UiCheckbox id="checkbox3" disabled>Unchecked disabled</UiCheckbox>
      <UiCheckbox id="checkbox4" checked disabled>Checked disabled</UiCheckbox>
      <UiRadio id="radio1">Unchecked</UiRadio>
      <UiRadio id="radio2" checked>Checked</UiRadio>
      <UiRadio id="radio3" disabled>Unchecked disabled</UiRadio>
      <UiRadio id="radio4" checked disabled>Checked disabled</UiRadio>
    </div>
    <div>
      <UiTitle is="h2" class="text-xl mb-3">Menu</UiTitle>
      <UiMenu>
        <UiMenuButton>
          <UiButton>
            Options
            <RiArrowDropDownLine aria-hidden="true" />
          </UiButton>
        </UiMenuButton>
        <UiMenuItems>
          <div class="px-4 py-3">
            <div class="font-bold">Dieter Luypaert</div>
            <small class="text-secondary-400 underline">
              dieter@foursevens.be
            </small>
          </div>
          <UiMenuItem>
            <RiPencilLine aria-hidden="true" class="text-secondary-400" />
            Edit
          </UiMenuItem>
          <UiMenuItem>
            <RiDeleteBinLine aria-hidden="true" class="text-danger-400" />
            Delete
          </UiMenuItem>
        </UiMenuItems>
      </UiMenu>
    </div>
  </div>
</template>
