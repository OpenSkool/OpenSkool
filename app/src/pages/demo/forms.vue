<script lang="ts" setup>
interface Education {
  id: number;
  name: string;
}

const educations: Education[] = [
  { id: 1, name: 'Informatics' },
  { id: 2, name: 'Chemistry' },
  { id: 3, name: 'Medicine' },
];

const values = reactive<{
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
  <h2 class="text-xl mb-3">Forms</h2>
  <h3 class="text-lg mb-3">Create competency</h3>
  <FormKit v-model="values" type="form" submit-label="Create competency">
    <FormKit
      name="competencyTitle"
      label="Title"
      type="text"
      validation="required"
    />
    <FormKit
      name="education1"
      type="radio"
      label="Education Radio"
      :options="
        educations.map((education) => ({
          label: education.name,
          value: education.id,
        }))
      "
      help="Which is your education?"
    />
    <FormKit
      name="education2"
      label="Education Listbox"
      type="listbox"
      :options="
        educations.map((education) => ({
          label: education.name,
          value: education.id,
        }))
      "
    />
  </FormKit>
</template>
