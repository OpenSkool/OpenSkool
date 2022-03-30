<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';

import { useDemoStore } from '~/demo-store';
import {
  CreateCompetencyMutation,
  CreateCompetencyMutationVariables,
} from '~/generated/graphql';

const demoStore = useDemoStore();
const router = useRouter();

const { mutate: createCompetency } = useMutation<
  CreateCompetencyMutation,
  CreateCompetencyMutationVariables
>(gql`
  mutation CreateCompetency(
    $currentUserId: ID!
    $data: CreateCompetencyInput!
  ) {
    createCompetency(currentUserId: $currentUserId, data: $data) {
      ... on CreateCompetencyErrorPayload {
        error {
          code
          message
          path
        }
      }
      ... on CreateCompetencySuccessPayload {
        competency {
          id
        }
      }
    }
  }
`);

const formErrors = ref<string[]>([]);
const formNode = ref<FormKitNode>();
const formValues = ref<{ title: string }>({ title: '' });

async function handleFormSubmit(): Promise<void> {
  formErrors.value = [];
  if (demoStore.activeUserId == null) {
    formErrors.value.push('No active user id selected.');
    return;
  }
  /* eslint-disable no-underscore-dangle */
  try {
    const response = await createCompetency({
      currentUserId: demoStore.activeUserId,
      data: formValues.value,
    });
    switch (response?.data?.createCompetency.__typename) {
      default:
        throw new Error('unknown api response');
      case 'CreateCompetencyErrorPayload': {
        const { error } = response.data.createCompetency;
        const fieldNode = formNode.value?.at(error.path);
        if (fieldNode) {
          fieldNode.setErrors([error.message]);
        } else {
          formErrors.value.push(error.message);
        }
        break;
      }
      case 'CreateCompetencySuccessPayload':
        router.push('/manage/competencies');
        break;
    }
  } catch {
    formErrors.value.push('Something went wrong');
  }
}
</script>

<template>
  <ui-backbutton to="/manage/competencies">Competencies</ui-backbutton>
  <h2 class="text-xl mb-3">Create competency</h2>
  <FormKit
    v-model="formValues"
    type="form"
    submit-label="Create competency"
    :errors="formErrors"
    @node="formNode = $event"
    @submit="handleFormSubmit"
  >
    <FormKit name="title" label="Title" type="text" validation="required" />
  </FormKit>
</template>
