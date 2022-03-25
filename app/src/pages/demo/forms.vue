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
  education1: Education | undefined;
}>({
  competencyTitle: '',
  education1: undefined,
});
</script>

<template>
  <h2 class="text-xl mb-3">Forms</h2>
  <h3 class="text-lg mb-3">Create competency</h3>
  <FormKit v-model="values" type="group">
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
    <FormKit type="submit">Create competency</FormKit>
  </FormKit>
</template>
