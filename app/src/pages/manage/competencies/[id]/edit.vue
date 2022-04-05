<route lang="yaml">
meta:
  requireDemoUser: true
</route>

<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';
import { useI18n } from 'vue-i18n';

import {
  GetCompetencyDocument,
  RenameCompetencyDocument,
} from '~/generated/graphql';
import { useI18nStore } from '~/i18n';
import { assert } from '~/utils';

const i18nStore = useI18nStore();
i18nStore.loadGlob(import.meta.glob('~/locales/competencies.*.yaml'));

const { t } = useI18n();

const router = useRouter();

const props = defineProps<{
  id: string; // route param
}>();

const { error, loading, result } = useQuery(
  GetCompetencyDocument,
  { id: props.id },
  { fetchPolicy: 'network-only' },
);
const competency = useResult(result);

gql`
  mutation RenameCompetency($id: ID!, $data: RenameCompetencyInput!) {
    renameCompetency(id: $id, data: $data) {
      ... on RenameCompetencySuccessPayload {
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

const { mutate: renameCompetency } = useMutation(RenameCompetencyDocument);

const formNode = ref<FormKitNode>();
const formErrors = ref<string[]>([]);
const formValues = ref<{ title: string }>();

watch(result, () => {
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
      id: props.id,
      data: formValues.value,
    });
    switch (response?.data?.renameCompetency.__typename) {
      default:
        throw new Error('unknown api response');
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
      case 'RenameCompetencySuccessPayload':
        switch (competency.value.__typename) {
          default:
            throw new Error('unknown competency type');
          case 'RootCompetency':
            router.push('/manage/competencies');
            break;
          case 'NestedCompetency':
            router.push(`/manage/competencies/${props.id}`);
            break;
        }
        break;
    }
  } catch {
    formErrors.value.push(t('competencies.form.action.edit.error'));
  }
}
</script>

<template>
  <template v-if="error">
    <p>Something went wrong</p>
  </template>
  <template v-else-if="loading">
    <div>Loading</div>
  </template>
  <template v-else-if="competency == null">
    <div>Not Found</div>
  </template>
  <template v-else>
    <ui-backbutton :to="`/manage/competencies/${competency.id}`">
      {{ competency.title }}
    </ui-backbutton>
    <h2 class="text-xl mb-3">{{ t('competencies.route.id.edit.heading') }}</h2>
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
</template>
