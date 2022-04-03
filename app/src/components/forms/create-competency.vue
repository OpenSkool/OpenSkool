<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';

import {
  CreateCompetencyMutation,
  CreateCompetencyMutationVariables,
} from '~/generated/graphql';

const router = useRouter();

const props = defineProps<{
  id?: string;
}>();

const { mutate: createCompetency } = useMutation<
  CreateCompetencyMutation,
  CreateCompetencyMutationVariables
>(gql`
  mutation CreateCompetency($data: CreateCompetencyInput!) {
    createCompetency(data: $data) {
      ... on CreateCompetencySuccessPayload {
        competency {
          id
        }
      }
      ... on UserError {
        code
        message
        path
      }
    }
  }
`);

const formErrors = ref<string[]>([]);
const formNode = ref<FormKitNode>();
const formValues = ref<{ title: string }>({ title: '' });

async function handleFormSubmit(): Promise<void> {
  formErrors.value = [];
  try {
    const response = await createCompetency({
      data: { parentId: props.id, title: formValues.value.title },
    });
    switch (response?.data?.createCompetency.__typename) {
      default:
        throw new Error('unknown api response');
      case 'UserError': {
        const mutationError = response.data.createCompetency;
        const fieldNode = formNode.value?.at(mutationError.path);
        if (fieldNode) {
          fieldNode.setErrors([mutationError.message]);
        } else {
          formErrors.value.push(mutationError.message);
        }
        break;
      }
      case 'CreateCompetencySuccessPayload':
        if (props.id == null) {
          router.push('/manage/competencies');
        } else {
          router.push(`/manage/competencies/${props.id}`);
        }
        break;
    }
  } catch {
    formErrors.value.push('Something went wrong');
  }
}
</script>
<template>
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
