<script lang="ts" setup>
import type { FormKitNode } from '@formkit/core';

import { InviteInternshipPositionMentorMutationDocument } from '~/codegen/graphql';

const props = defineProps<{ positionId: string }>();

gql`
  mutation InviteInternshipPositionMentorMutation(
    $email: String!
    $positionId: ID!
  ) {
    inviteInternshipPositionMentor(email: $email, positionId: $positionId) {
      id
      mentors {
        id
        name
      }
    }
  }
`;

interface FormValues {
  email: string;
}
const formValues = ref<FormValues>({
  email: '',
});

const { loading, mutate } = useMutation(
  InviteInternshipPositionMentorMutationDocument,
);

async function handleFormSubmit(node: FormKitNode | undefined): Promise<void> {
  const { email } = formValues.value;
  try {
    await mutate({ ...props, email });
    node?.reset();
  } catch (error) {
    console.error('could not apply for internship position', error);
  }
}
</script>

<template>
  <UiNotification color="caution" heading="Invite mentor">
    <FormKit
      v-model="formValues"
      :disabled="loading"
      type="form"
      submit-label="Invite mentor"
      @submit="(_, node) => handleFormSubmit(node)"
    >
      <FormKit
        label="Email"
        placeholder="joske@vermeulen.be"
        name="email"
        type="email"
        validation="required|email"
      />
    </FormKit>
  </UiNotification>
</template>
