<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';

import { useDemoStore } from '~/demo-store';
import {
  RenameCompetencyMutation,
  RenameCompetencyMutationVariables,
  GetCompetencyQuery,
} from '~/generated/graphql';
import { READ_COMPETENCY_QUERY } from '~/gql';
import { assert } from '~/utils';

const demoStore = useDemoStore();
const router = useRouter();

const props = defineProps<{
  id: string; // route param
}>();

const { error, loading, result } = useQuery<GetCompetencyQuery>(
  READ_COMPETENCY_QUERY,
  { id: props.id },
  { fetchPolicy: 'network-only' },
);
const competency = useResult(result);

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
  if (competency.value != null) {
    formValues.value = { title: competency.value.title };
  }
});

async function handleFormSubmit(): Promise<void> {
  assert(formValues.value, 'formValues');
  assert(competency.value, 'competency');
  formErrors.value = [];
  if (demoStore.activeUserId == null) {
    formErrors.value.push('No active user id selected.');
    return;
  }
  try {
    const response = await renameCompetency({
      currentUserId: demoStore.activeUserId,
      id: props.id,
      data: formValues.value,
    });
    switch (response?.data?.renameCompetency.__typename) {
      default:
        throw new Error('unknown api response');
      case 'RenameCompetencyErrorPayload': {
        const mutationError = response.data.renameCompetency.error;
        const fieldNode = formNode.value?.at(mutationError.path);
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
            router.push(`/manage/competencies/${competency.value.parentId}`);
            break;
        }
        break;
    }
  } catch {
    formErrors.value.push('Something went wrong');
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
  <template v-else>
    <ui-backbutton to="/manage/competencies">Competencies</ui-backbutton>
    <h2 class="text-xl mb-3">Edit competency</h2>
    <template v-if="competency == null">
      <div>Not Found</div>
    </template>
    <template v-else>
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
  </template>
</template>
