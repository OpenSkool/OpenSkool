<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';

import { CreateRootCompetencyDocument } from '~/codegen/graphql';

const props = defineProps<{
  frameworkId: string;
}>();

const { t } = useI18n();
const router = useRouter();

gql`
  mutation CreateRootCompetency($data: CreateRootCompetencyInput!) {
    createRootCompetency(data: $data) {
      ... on MutationCreateRootCompetencySuccess {
        data {
          framework {
            competencies {
              id
              title
            }
          }
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { mutate: createRootCompetency } = useMutation(
  CreateRootCompetencyDocument,
);

const formErrors = ref<string[]>([]);
const formNode = ref<FormKitNode>();
const formValues = ref<{ title: string }>({ title: '' });

async function handleFormSubmit(): Promise<void> {
  formErrors.value = [];
  try {
    const response = await createRootCompetency({
      data: { frameworkId: props.frameworkId, title: formValues.value.title },
    });
    switch (response?.data?.createRootCompetency.__typename) {
      default:
        console.error(
          'unexpected mutation response',
          response?.data?.createRootCompetency,
        );
        formErrors.value.push(t('management.competency.create.error.internal'));
        return;
      case 'InputError': {
        const mutationError = response.data.createRootCompetency;
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
      case 'MutationCreateRootCompetencySuccess':
        router.push(`/manage/competencies/${props.frameworkId}`);
        break;
    }
  } catch (error) {
    console.error('crash during execution', error);
    formErrors.value.push(t('management.competency.create.error.internal'));
  }
}
</script>

<template>
  <FormKit
    v-model="formValues"
    type="form"
    :submit-label="t('management.competency.create.submitButton')"
    :errors="formErrors"
    @node="formNode = $event"
    @submit="handleFormSubmit"
  >
    <FormKit
      name="title"
      :label="t('management.competency.field.name')"
      type="text"
      validation="required"
    />
  </FormKit>
</template>
