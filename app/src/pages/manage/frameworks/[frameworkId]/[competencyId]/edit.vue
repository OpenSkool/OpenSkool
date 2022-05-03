<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';
import { useI18n } from 'vue-i18n';

import { useAuthStore } from '~/auth';
import {
  GetEditCompetencyDocument,
  RenameCompetencyDocument,
} from '~/codegen/graphql';
import { useI18nStore } from '~/i18n';
import { assert } from '~/utils';

const authStore = useAuthStore();

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/competencies.*.yaml'));

const { t } = useI18n();

const router = useRouter();

const props = defineProps<{
  competencyId: string;
  frameworkId: string;
}>();

gql`
  query getEditCompetency($id: ID!) {
    competency(id: $id) {
      __typename
      ... on QueryCompetencySuccess {
        data {
          title
        }
      }
      ...BaseErrorFields
    }
  }
`;

const {
  error: getEditCompetencyError,
  loading,
  result,
} = useQuery(
  GetEditCompetencyDocument,
  { id: props.competencyId },
  { fetchPolicy: 'network-only' },
);
const competency = useResult(result);

gql`
  mutation renameCompetency($id: ID!, $data: RenameCompetencyInput!) {
    renameCompetency(id: $id, data: $data) {
      __typename
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

watch(result, () => {
  if (competency.value?.__typename === 'QueryCompetencySuccess') {
    formValues.value = { title: competency.value.data.title };
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
          `/manage/frameworks/${props.frameworkId}/${props.competencyId}`,
        );
        break;
    }
  } catch (error) {
    console.error('crash during execution', error);
    formErrors.value.push(t('competencies.form.action.edit.error'));
  }
}
</script>

<template>
  <template v-if="authStore.isLoggedIn">
    <template v-if="getEditCompetencyError">
      <p>Something went wrong</p>
    </template>
    <template v-else-if="loading">
      <div>Loading</div>
    </template>
    <template v-else-if="competency?.__typename == 'QueryCompetencySuccess'">
      <ui-backbutton :to="`/manage/frameworks/${frameworkId}/${competencyId}`">
        {{ competency.data.title }}
      </ui-backbutton>
      <h2 class="text-xl mb-3">
        {{ t('competencies.route.id.edit.heading') }}
      </h2>
      <FormKit
        v-if="formValues != null"
        v-model="formValues"
        type="form"
        :submit-label="t('competencies.form.action.edit.label')"
        :errors="formErrors"
        @submit="handleFormSubmit"
        @node="formNode = $event"
      >
        <FormKit
          name="title"
          :label="t('competencies.form.nameLabel')"
          type="text"
          validation="required"
        />
      </FormKit>
    </template>
    <template v-else>
      <div>Not Found</div>
    </template>
  </template>
  <template v-else>
    <unauthorized></unauthorized>
  </template>
</template>
