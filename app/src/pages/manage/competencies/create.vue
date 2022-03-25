<script lang="ts" setup>
import {
  CreateCompetencyMutation,
  CreateCompetencyMutationVariables,
} from '~/generated/graphql';

const values = reactive<{ title: string }>({ title: '' });

const { mutate: createCompetency } = useMutation<
  CreateCompetencyMutation,
  CreateCompetencyMutationVariables
>(gql`
  mutation CreateCompetency($title: String!) {
    createCompetency(currentUserId: "no-user-yet", data: { title: $title }) {
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

async function handleFormSubmit(): Promise<void> {
  /* eslint-disable no-underscore-dangle */
  try {
    const response = await createCompetency(values);
    switch (response?.data?.createCompetency.__typename) {
      default:
        throw new Error('unknown api response');
      case 'CreateCompetencyErrorPayload':
        // response.data.createCompetency.error
        break;
      case 'CreateCompetencySuccessPayload':
        // response.data.createCompetency.competency
        break;
    }
  } catch {
    //
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
    @submit="handleFormSubmit"
  >
    <FormKit
      name="competencyTitle"
      label="Title"
      type="text"
      validation="required"
    />
  </FormKit>
</template>
