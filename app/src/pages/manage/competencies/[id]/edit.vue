<script lang="ts" setup>
import { useDemoStore } from '~/demo-store';
import {
  RenameCompetencyMutation,
  RenameCompetencyMutationVariables,
  GetRootCompetencyQuery,
} from '~/generated/graphql';

const formErrors = ref<string[]>([]);
const values = ref<{ title: string }>();

const route = useRoute();
const { id } = route.params as { id: string };

const { result } = useQuery<GetRootCompetencyQuery>(
  gql`
    query getRootCompetency($id: ID!) {
      rootCompetency(id: $id) {
        id
        title
      }
    }
  `,
  { id },
  {
    fetchPolicy: 'network-only',
  },
);

// watchEffect
watch(result, () => {
  if (result.value?.rootCompetency != null) {
    values.value = { title: result.value.rootCompetency.title };
  }
});

const { mutate: renameCompetency } = useMutation<
  RenameCompetencyMutation,
  RenameCompetencyMutationVariables
>(gql`
  mutation RenameCompetency($currentUserId: ID!, $id: ID!, $title: String!) {
    renameCompetency(
      currentUserId: $currentUserId
      id: $id
      data: { title: $title }
    ) {
      ... on RenameCompetencyErrorPayload {
        error {
          code
          message
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
    const response = await renameCompetency({
      currentUserId: demoStore.activeUserId,
      id,
      title: values.value!.title,
    });
    switch (response?.data?.renameCompetency.__typename) {
      default:
        throw new Error('unknown api response');
      case 'RenameCompetencyErrorPayload':
        formErrors.value.push(response.data.renameCompetency.error.message);
        break;
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
    v-if="values != null"
    v-model="values"
    type="form"
    submit-label="Edit competency"
    :errors="formErrors"
    @submit="handleFormSubmit"
  >
    <FormKit name="title" label="Title" type="text" validation="required" />
  </FormKit>
</template>
