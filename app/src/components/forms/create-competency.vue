<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';

import { CreateCompetencyDocument } from '~/generated/graphql';

const router = useRouter();

const props = defineProps<{
  id?: string;
}>();

gql`
  mutation CreateCompetency($data: CreateCompetencyInput!) {
    createCompetency(data: $data) {
      ... on CreateCompetencySuccessPayload {
        competency {
          id
        }
      }
      ... on InputError {
        code
        message
        path
      }
    }
  }
`;

const { mutate: createCompetency } = useMutation(CreateCompetencyDocument);

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
        formErrors.value.push('TEST ERROR');
        return;
      case 'InputError': {
        const mutationError = response.data.createCompetency;
        const fieldNode =
          mutationError.path == null
            ? undefined
            : formNode.value?.at(mutationError.path);
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
