<script lang="ts" setup>
import { i18nLoaderService, LoaderMap } from '~/i18n';

await i18nLoaderService.loadGlob(
  import.meta.glob('./locales/demo.*.yaml') as LoaderMap,
);

interface Education {
  id: number;
  name: string;
}

const educations: Education[] = [
  { id: 1, name: 'Informatics' },
  { id: 2, name: 'Chemistry' },
  { id: 3, name: 'Medicine' },
];

const educationOptions = educations.map((education) => ({
  label: education.name,
  value: education.id,
}));

const values = ref<{
  competencyTitle: string;
  competencyDescription: string;
  education1: number | undefined;
  education2: number | undefined;
  education3: number | undefined;
}>({
  competencyTitle: '',
  competencyDescription:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  education1: undefined,
  education2: undefined,
  education3: undefined,
});
</script>

<template>
  <UiTitle is="h1" class="text-xl mb-3">
    {{ $t('demo.forms.title') }}
  </UiTitle>
  <UiTitle is="h2" class="text-lg mb-3">
    {{ $t('demo.forms.subTitle') }}
  </UiTitle>
  <FormKit
    v-model="values"
    type="form"
    :submit-label="$t('demo.forms.submitButton')"
  >
    <FormKit
      name="competencyTitle"
      :label="$t('demo.forms.field.title')"
      type="text"
      validation="required"
    />
    <FormKit
      name="competencyDescription"
      label="Description"
      type="textarea"
      validation="required"
    />
    <FormKit
      name="education1"
      type="radio"
      :label="$t('demo.forms.field.education1.label')"
      :options="educationOptions"
      :help="$t('demo.forms.field.education1.help')"
    />
    <FormKit
      name="education2"
      type="checkbox"
      label="Education Checkbox"
      :options="educationOptions"
      :help="$t('demo.forms.field.education1.help')"
    />
    <FormKit
      name="education3"
      :label="$t('demo.forms.field.education2')"
      type="select"
      :options="educationOptions"
    />
  </FormKit>
</template>
