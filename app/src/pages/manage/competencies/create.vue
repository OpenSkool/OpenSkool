<script lang="ts" setup>
import { useDemoStore } from '~/demo-store';
import {
  CreateCompetencyMutation,
  CreateCompetencyMutationVariables,
} from '~/generated/graphql';

const formErrors = ref<string[]>([]);
const values = reactive<{ title: string }>({ title: '' });

const { mutate: createCompetency } = useMutation<
  CreateCompetencyMutation,
  CreateCompetencyMutationVariables
>(gql`
  mutation CreateCompetency($currentUserId: ID!, $title: String!) {
    createCompetency(currentUserId: $currentUserId, data: { title: $title }) {
      ... on CreateCompetencyErrorPayload {
        error {
          code
          message
        }
      }
      ... on CreateCompetencySuccessPayload {
        competency {
          id
        }
      }
    }
  }
`);

const demoStore = useDemoStore();
const router = useRouter();
async function handleFormSubmit(): Promise<void> {
  formErrors.value = [];
  if (demoStore.activeUserId == null) {
    formErrors.value.push('No active user id selected.');
    return;
  }
  /* eslint-disable no-underscore-dangle */
  try {
    const response = await createCompetency({
      currentUserId: demoStore.activeUserId,
      title: values.title,
    });
    switch (response?.data?.createCompetency.__typename) {
      default:
        throw new Error('unknown api response');
      case 'CreateCompetencyErrorPayload':
        formErrors.value.push(response.data.createCompetency.error.message);
        break;
      case 'CreateCompetencySuccessPayload':
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
    <li>Create</li>
  </ui-breadcrumb>
  <h2 class="text-xl mb-3">Create competency</h2>
  <FormKit
    v-model="values"
    type="form"
    submit-label="Create competency"
    :errors="formErrors"
    @submit="handleFormSubmit"
  >
    <FormKit name="title" label="Title" type="text" validation="required" />
  </FormKit>
</template>
