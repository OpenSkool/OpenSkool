<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';

import { useDemoStore } from '~/demo-store';
import {
  CreateCompetencyMutation,
  CreateCompetencyMutationVariables,
} from '~/generated/graphql';

const demoStore = useDemoStore();
const router = useRouter();

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: undefined,
  },
});

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
  try {
    const response = await createCompetency({
      currentUserId: demoStore.activeUserId,
      data: { parentId: props.id, title: formValues.value.title },
    });
    switch (response?.data?.createCompetency.__typename) {
      default:
        throw new Error('unknown api response');
      case 'CreateCompetencyErrorPayload': {
        const { error: createError } = response.data.createCompetency;
        const fieldNode = formNode.value?.at(createError.path);
        if (fieldNode) {
          fieldNode.setErrors([createError.message]);
        } else {
          formErrors.value.push(createError.message);
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
