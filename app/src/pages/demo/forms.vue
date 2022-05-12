<script lang="ts" setup>
import { useI18nStore } from '~/i18n';

const i18nStore = useI18nStore();
await i18nStore.loadGlob(import.meta.glob('./locales/demo.*.yaml'));

const { t } = useI18n();

interface Education {
  id: number;
  name: string;
}

const educations: Education[] = [
  { id: 1, name: 'Informatics' },
  { id: 2, name: 'Chemistry' },
  { id: 3, name: 'Medicine' },
];

const values = ref<{
  competencyTitle: string;
  education1: string | undefined;
  education2: number | undefined;
}>({
  competencyTitle: '',
  education1: undefined,
  education2: undefined,
});
</script>

<template>
  <UiTitle is="h2" v-t="'demo.forms.title'" class="text-xl mb-3" />
  <UiTitle is="h3" v-t="'demo.forms.subTitle'" class="text-lg mb-3" />
  <FormKit
    v-model="values"
    type="form"
    :submit-label="t('demo.forms.submitButton')"
  >
    <FormKit
      name="competencyTitle"
      :label="t('demo.forms.field.title')"
      type="text"
      validation="required"
    />
    <FormKit
      name="education1"
      type="radio"
      :label="t('demo.forms.field.education1.label')"
      :options="
        educations.map((education) => ({
          label: education.name,
          value: education.id,
        }))
      "
      :help="t('demo.forms.field.education1.help')"
    />
    <FormKit
      name="education2"
      :label="t('demo.forms.field.education2')"
      type="UiSelect"
      :options="
        educations.map((education) => ({
          label: education.name,
          value: education.id,
        }))
      "
    />
  </FormKit>
</template>
