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
  <div class="space-y-10">
    <div class="">
      <UiTitle is="h2" class="text-xl">Alert</UiTitle>
      <div class="space-y-3">
        <UiAlert heading="Default alert">
          <p>
            This is a default alert with some content and
            <a href="#" class="alert-link">a link</a>.
          </p>
        </UiAlert>
        <UiAlert color="primary" heading="Primary alert">
          <p>
            This is a primary alert with some content and
            <a href="#" class="alert-link">a link</a>.
          </p>
        </UiAlert>
        <UiAlert color="caution" heading="Caution alert">
          <p>
            This is a caution alert with some content and
            <a href="#" class="alert-link">a link</a>.
          </p>
        </UiAlert>
        <UiAlert color="danger" heading="Danger alert">
          <p>
            This is a danger alert with some content and
            <a href="#" class="alert-link">a link</a>.
          </p>
        </UiAlert>
        <UiAlert color="info" heading="Info alert">
          <p>
            This is an info alert with some content and
            <a href="#" class="alert-link">a link</a>.
          </p>
        </UiAlert>
        <UiAlert color="success" heading="Success alert">
          <p>
            This is a success alert with some content and
            <a href="#" class="alert-link">a link</a>.
          </p>
        </UiAlert>
      </div>
    </div>
    <div>
      <UiTitle is="h2" class="text-xl">Title</UiTitle>
      <UiSubtitle is="h3">Subtitle</UiSubtitle>
    </div>
    <div>
      <UiTitle is="h2" class="text-xl">Palette</UiTitle>
      <UiSubtitle is="h3">Gray</UiSubtitle>
      <div class="space-x-3">
        <div class="bg-gray-100 palette" />
        <div class="bg-gray-200 palette" />
        <div class="bg-gray-300 palette" />
        <div class="bg-gray-400 palette" />
        <div class="bg-gray-500 palette" />
        <div class="bg-gray-600 palette" />
        <div class="bg-gray-700 palette" />
        <div class="bg-gray-800 palette" />
        <div class="bg-gray-900 palette" />
      </div>
      <UiSubtitle is="h3">Primary</UiSubtitle>
      <div class="space-x-3">
        <div class="bg-primary-100 palette" />
        <div class="bg-primary-200 palette" />
        <div class="bg-primary-300 palette" />
        <div class="bg-primary-400 palette" />
        <div class="bg-primary-500 palette" />
        <div class="bg-primary-600 palette" />
        <div class="bg-primary-700 palette" />
        <div class="bg-primary-800 palette" />
        <div class="bg-primary-900 palette" />
      </div>
      <UiSubtitle is="h3">Caution</UiSubtitle>
      <div class="space-x-3">
        <div class="bg-caution-100 palette" />
        <div class="bg-caution-200 palette" />
        <div class="bg-caution-300 palette" />
        <div class="bg-caution-400 palette" />
        <div class="bg-caution-500 palette" />
        <div class="bg-caution-600 palette" />
        <div class="bg-caution-700 palette" />
        <div class="bg-caution-800 palette" />
        <div class="bg-caution-900 palette" />
      </div>
      <UiSubtitle is="h3">Danger</UiSubtitle>
      <div class="space-x-3">
        <div class="bg-danger-100 palette" />
        <div class="bg-danger-200 palette" />
        <div class="bg-danger-300 palette" />
        <div class="bg-danger-400 palette" />
        <div class="bg-danger-500 palette" />
        <div class="bg-danger-600 palette" />
        <div class="bg-danger-700 palette" />
        <div class="bg-danger-800 palette" />
        <div class="bg-danger-900 palette" />
      </div>
      <UiSubtitle is="h3">Info</UiSubtitle>
      <div class="space-x-3">
        <div class="bg-info-100 palette" />
        <div class="bg-info-200 palette" />
        <div class="bg-info-300 palette" />
        <div class="bg-info-400 palette" />
        <div class="bg-info-500 palette" />
        <div class="bg-info-600 palette" />
        <div class="bg-info-700 palette" />
        <div class="bg-info-800 palette" />
        <div class="bg-info-900 palette" />
      </div>
      <UiSubtitle is="h3">Success</UiSubtitle>
      <div class="space-x-3">
        <div class="bg-success-100 palette" />
        <div class="bg-success-200 palette" />
        <div class="bg-success-300 palette" />
        <div class="bg-success-400 palette" />
        <div class="bg-success-500 palette" />
        <div class="bg-success-600 palette" />
        <div class="bg-success-700 palette" />
        <div class="bg-success-800 palette" />
        <div class="bg-success-900 palette" />
      </div>
    </div>
    <div>
      <UiTitle is="h2" class="text-xl mb-3">Buttons</UiTitle>
      <div class="bg-white rounded-md space-y-3 -m-3 p-3">
        <div class="space-x-3">
          <UiButton color="primary">Button</UiButton>
          <UiButton color="primary" disabled>Button</UiButton>
          <UiButton color="primary" outline>Button</UiButton>
          <UiButton color="primary" disabled outline>Button</UiButton>
        </div>
        <div class="space-x-3">
          <UiButton color="danger">Button</UiButton>
          <UiButton color="danger" disabled>Button</UiButton>
          <UiButton color="danger" outline>Button</UiButton>
          <UiButton color="danger" disabled outline>Button</UiButton>
        </div>
        <div class="space-x-3">
          <UiButton color="primary" size="sm">Button</UiButton>
          <UiButton color="danger" size="sm">Button</UiButton>
        </div>
        <div>
          <UiIconButton label="Edit">
            <RiEdit2Line />
          </UiIconButton>
        </div>
      </div>
    </div>
    <div>
      <UiTitle is="h2" class="text-xl mb-3">Tabs</UiTitle>
      <UiTabs>
        <UiTab title="Button 1">Panel 1</UiTab>
        <UiTab title="Button 2">Panel 2</UiTab>
        <UiTab title="Button 3">Panel 3</UiTab>
      </UiTabs>
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
      <label>
        <p>Input</p>
        <UiInputText v-model="inputText" placeholder="Hello World!" />
      </label>
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
            <RiArrowDropDownLine aria-hidden />
          </UiButton>
        </UiMenuButton>
        <UiMenuItems>
          <div class="py-3 px-4">
            <div class="font-bold">Dieter Luypaert</div>
            <small class="text-primary-400 underline">
              dieter@foursevens.be
            </small>
          </div>
          <UiMenuItem>
            <RiPencilLine aria-hidden class="text-primary-400" />
            Edit
          </UiMenuItem>
          <UiMenuItem>
            <RiDeleteBinLine aria-hidden class="text-danger-400" />
            Delete
          </UiMenuItem>
        </UiMenuItems>
      </UiMenu>
    </div>
  </div>
</template>

<style scoped>
.palette {
  @apply h-16 w-16 inline-block;
}
</style>
