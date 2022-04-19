<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';
import { useI18n } from 'vue-i18n';

import { CreateCompetencyFrameworkDocument } from '~/generated/graphql';

const { t } = useI18n();

const router = useRouter();

const props = defineProps<{
  id?: string;
}>();

gql`
  mutation CreateCompetencyFramework($data: CreateCompetencyFrameworkInput!) {
    createCompetencyFramework(data: $data) {
      ... on CreateCompetencyFrameworkSuccessPayload {
        competencyFramework {
          id
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { mutate: createCompetencyFramework } = useMutation(
  CreateCompetencyFrameworkDocument,
);

const formErrors = ref<string[]>([]);
const formNode = ref<FormKitNode>();
const formValues = ref<{ title: string }>({ title: '' });

async function handleFormSubmit(): Promise<void> {
  formErrors.value = [];
  try {
    const response = await createCompetencyFramework({
      data: { title: formValues.value.title },
    });
    switch (response?.data?.createCompetencyFramework.__typename) {
      default:
        console.error(
          'unexpected mutation response',
          response?.data?.createCompetencyFramework,
        );
        formErrors.value.push(t('frameworks.form.action.create.error'));
        return;
      case 'InputError': {
        const mutationError = response.data.createCompetencyFramework;
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
      case 'CreateCompetencyFrameworkSuccessPayload':
        router.push('/manage/frameworks');
        break;
    }
  } catch (error) {
    console.error('crash during execution', error);
    formErrors.value.push(t('frameworks.form.action.create.error'));
  }
}
</script>

<template>
  <FormKit
    v-model="formValues"
    type="form"
    :submit-label="t('frameworks.form.action.create.label')"
    :errors="formErrors"
    @node="formNode = $event"
    @submit="handleFormSubmit"
  >
    <FormKit
      name="title"
      :label="t('frameworks.form.nameLabel')"
      type="text"
      validation="required"
    />
  </FormKit>
</template>
