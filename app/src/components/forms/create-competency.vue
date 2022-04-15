<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';
import { useI18n } from 'vue-i18n';

import { CreateCompetencyDocument } from '~/generated/graphql';

const { t } = useI18n();

const router = useRouter();

const props = defineProps<{
  id?: string;
}>();

gql`
  mutation CreateCompetency($data: CreateCompetencyInput!) {
    createCompetency(data: $data) {
      ... on MutationCreateCompetencySuccess {
        data {
          id
        }
      }
      ...BaseErrorFields
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
        console.error(
          'unexpected mutation response',
          response?.data?.createCompetency,
        );
        formErrors.value.push(t('competencies.form.action.create.error'));
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
      case 'MutationCreateCompetencySuccess':
        if (props.id == null) {
          router.push('/manage/competencies');
        } else {
          router.push(`/manage/competencies/${props.id}`);
        }
        break;
    }
  } catch (error) {
    console.error('crash during execution', error);
    formErrors.value.push(t('competencies.form.action.create.error'));
  }
}
</script>

<template>
  <FormKit
    v-model="formValues"
    type="form"
    :submit-label="t('competencies.form.action.create.label')"
    :errors="formErrors"
    @node="formNode = $event"
    @submit="handleFormSubmit"
  >
    <FormKit
      name="title"
      :label="t('competencies.form.nameLabel')"
      type="text"
      validation="required"
    />
  </FormKit>
</template>
