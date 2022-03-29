<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';

import { useDemoStore } from '~/demo-store';
import {
  RenameCompetencyMutation,
  RenameCompetencyMutationVariables,
  GetRootCompetencyQuery,
} from '~/generated/graphql';

const demoStore = useDemoStore();
const router = useRouter();

const props = defineProps<{
  id: string; // route param
}>();

const { result } = useQuery<GetRootCompetencyQuery>(
  gql`
    query getRootCompetency($id: ID!) {
      rootCompetency(id: $id) {
        id
        title
      }
    }
  `,
  { id: props.id },
  { fetchPolicy: 'network-only' },
);

const { mutate: renameCompetency } = useMutation<
  RenameCompetencyMutation,
  RenameCompetencyMutationVariables
>(gql`
  mutation RenameCompetency(
    $currentUserId: ID!
    $id: ID!
    $data: RenameCompetencyInput!
  ) {
    renameCompetency(currentUserId: $currentUserId, id: $id, data: $data) {
      ... on RenameCompetencyErrorPayload {
        error {
          code
          message
          path
        }
      }
      ... on RenameCompetencySuccessPayload {
        competency {
          id
        }
      }
    }
  }
`);

const formNode = ref<FormKitNode>();
const formErrors = ref<string[]>([]);
const formValues = ref<{ title: string }>();

watch(result, () => {
  if (result.value?.rootCompetency != null) {
    formValues.value = { title: result.value.rootCompetency.title };
  }
});

async function handleFormSubmit(): Promise<void> {
  formErrors.value = [];
  if (demoStore.activeUserId == null) {
    formErrors.value.push('No active user id selected.');
    return;
  }
  /* eslint-disable no-underscore-dangle */
  try {
    const response = await renameCompetency({
      currentUserId: demoStore.activeUserId,
      id: props.id,
      data: formValues.value!,
    });
    switch (response?.data?.renameCompetency.__typename) {
      default:
        throw new Error('unknown api response');
      case 'RenameCompetencyErrorPayload': {
        const { error } = response.data.renameCompetency;
        const fieldNode = formNode.value?.at(error.path);
        if (fieldNode) {
          fieldNode.setErrors([error.message]);
        } else {
          formErrors.value.push(error.message);
        }
        break;
      }
      case 'RenameCompetencySuccessPayload':
        router.push('/manage/competencies');
        break;
    }
  } catch {
    formErrors.value.push('Something went wrong');
  }
}
</script>

<template>
  <ui-breadcrumb class="mb-5">
    <li>Manage</li>
    <li><router-link to="/manage/competencies">Competencies</router-link></li>
    <li>{{ result?.rootCompetency?.title }}</li>
    <li>Edit</li>
  </ui-breadcrumb>
  <h2 class="text-xl mb-3">Edit competency</h2>
  <FormKit
    v-if="formValues != null"
    v-model="formValues"
    type="form"
    submit-label="Edit competency"
    :errors="formErrors"
    @submit="handleFormSubmit"
    @node="formNode = $event"
  >
    <FormKit name="title" label="Title" type="text" validation="required" />
  </FormKit>
</template>
