<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';

import { CreateNestedCompetencyDocument } from '~/codegen/graphql';

const props = defineProps<{
  competencyId: string;
  frameworkId: string;
}>();

const { t } = useI18n();
const router = useRouter();

gql`
  mutation CreateNestedCompetency($data: CreateNestedCompetencyInput!) {
    createNestedCompetency(data: $data) {
      ... on MutationCreateNestedCompetencySuccess {
        data {
          id
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { mutate: createNestedCompetency } = useMutation(
  CreateNestedCompetencyDocument,
);

const formErrors = ref<string[]>([]);
const formNode = ref<FormKitNode>();
const formValues = ref<{ title: string }>({ title: '' });

async function handleFormSubmit(): Promise<void> {
  formErrors.value = [];
  try {
    const response = await createNestedCompetency({
      data: { parentId: props.competencyId, title: formValues.value.title },
    });
    switch (response?.data?.createNestedCompetency.__typename) {
      default:
        console.error(
          'unexpected mutation response',
          response?.data?.createNestedCompetency,
        );
        formErrors.value.push(t('management.competency.create.error.internal'));
        return;
      case 'InputError': {
        const mutationError = response.data.createNestedCompetency;
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
      case 'MutationCreateNestedCompetencySuccess':
        router.push(
          `/manage/competencies/${props.frameworkId}/${props.competencyId}`,
        );
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
