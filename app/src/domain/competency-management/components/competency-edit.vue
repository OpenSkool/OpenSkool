<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';

import {
  ManageEditCompetencyDocument,
  RenameCompetencyDocument,
} from '~/codegen/graphql';
import { useGlobalStore } from '~/domain/global';
import { assert } from '~/utils';

const props = defineProps<{
  competencyId: string;
  frameworkId: string;
}>();

const { t } = useI18n();
const router = useRouter();

const globalStore = useGlobalStore();

gql`
  query manageEditCompetency($id: ID!) {
    competency(id: $id) {
      ... on QueryCompetencySuccess {
        data {
          title
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { loading, onError, result } = useQuery(
  ManageEditCompetencyDocument,
  { id: props.competencyId },
  { fetchPolicy: 'network-only' },
);
onError(globalStore.handleFatalApolloError);

const competency = computed(() =>
  result.value?.competency?.__typename === 'QueryCompetencySuccess'
    ? result.value.competency.data
    : null,
);

gql`
  mutation renameCompetency($id: ID!, $data: RenameCompetencyInput!) {
    renameCompetency(id: $id, data: $data) {
      ... on MutationRenameCompetencySuccess {
        data {
          id
        }
      }
      ...BaseErrorFields
    }
  }
`;

const { mutate: renameCompetency } = useMutation(RenameCompetencyDocument);

const formNode = ref<FormKitNode>();
const formErrors = ref<string[]>([]);
const formValues = ref<{ title: string }>();

watch(competency, () => {
  if (competency.value != null) {
    formValues.value = { title: competency.value.title };
  }
});

async function handleFormSubmit(): Promise<void> {
  assert(formValues.value, 'formValues');
  assert(competency.value, 'competency');
  formErrors.value = [];
  try {
    const response = await renameCompetency({
      id: props.competencyId,
      data: formValues.value,
    });
    switch (response?.data?.renameCompetency.__typename) {
      default:
        console.error(
          'unexpected mutation response',
          response?.data?.renameCompetency,
        );
        formErrors.value.push('Something went wrong');
        return;
      case 'InputError': {
        const mutationError = response.data.renameCompetency;
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
      case 'MutationRenameCompetencySuccess':
        router.push(
          `/manage/competencies/${props.frameworkId}/${props.competencyId}`,
        );
        break;
    }
  } catch (error) {
    console.error('crash during execution', error);
    formErrors.value.push(t('management.competency.edit.error.internal'));
  }
}
</script>

<template>
  <template v-if="!loading">
    <FormKit
      v-if="formValues != null"
      v-model="formValues"
      type="form"
      :submit-label="t('management.competency.edit.submitButton')"
      :errors="formErrors"
      @submit="handleFormSubmit"
      @node="formNode = $event"
    >
      <FormKit
        name="title"
        :label="t('management.competency.field.name')"
        type="text"
        validation="required"
      />
    </FormKit>
  </template>
</template>
