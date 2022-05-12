<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';

import {
  GetEditCompetencyDocument,
  RenameCompetencyDocument,
} from '~/codegen/graphql';
import { useI18nStore } from '~/i18n';
import { assert } from '~/utils';

const ability = useAppAbility();

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
          competencyFramework {
            id
            title
          }
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
const competency = computed(() =>
  result.value?.competency?.__typename === 'QueryCompetencySuccess'
    ? result.value.competency.data
    : null,
);

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
  <template v-if="ability.can('update', 'CompetencyFramework')">
    <template v-if="getEditCompetencyError">
      <p>Something went wrong</p>
    </template>
    <template v-else-if="loading">
      <div>Loading</div>
    </template>
    <template v-else>
      <UiBreadcrumb>
        <UiBreadcrumbLink to="/manage/frameworks">
          <span v-t="'frameworks.route.index.heading'" />
        </UiBreadcrumbLink>
        <template v-if="competency?.competencyFramework">
          <UiBreadcrumbLink
            :to="`/manage/frameworks/${competency.competencyFramework.id}`"
          >
            {{ competency.competencyFramework.title }}
          </UiBreadcrumbLink>
          <UiBreadcrumbLink
            :to="`/manage/frameworks/${competency.competencyFramework.id}/${competencyId}`"
          >
            {{ competency.title }}
          </UiBreadcrumbLink>
        </template>
      </UiBreadcrumb>
      <UiTitle
        v-t="'competencies.route.id.edit.heading'"
        class="text-xl mb-3"
      />
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
          :label="t('competencies.form.name')"
          type="text"
          validation="required"
        />
      </FormKit>
    </template>
  </template>
  <template v-else>
    <AuthAccessDenied />
  </template>
</template>
