<script lang="ts" setup>
import { ApplyForInternshipMutationDocument } from '~/codegen/graphql';

const props = defineProps<{
  instanceId: string;
  positionId: string;
}>();

const emit = defineEmits<(event: 'applied') => void>();

gql`
  mutation ApplyForInternshipMutation(
    $instanceId: ID!
    $positionId: ID!
    $priority: Int!
  ) {
    applyForPriorityInternshipPosition(
      instanceId: $instanceId
      positionId: $positionId
      priority: $priority
    ) {
      __typename
    }
  }
`;

const formValues = ref<{
  priority: number | null;
}>({
  priority: null,
});

const priorityOptions = [1, 2, 3]; // eslint-disable-line @typescript-eslint/no-magic-numbers

const { loading, mutate } = useMutation(ApplyForInternshipMutationDocument);

async function handleFormSubmit(): Promise<void> {
  try {
    await mutate({ ...props, priority: 1 });
    emit('applied');
  } catch (error) {
    console.error('could not apply for internship position', error);
  }
}
</script>

<template>
  <UiNotification color="info" heading="Available">
    <div class="grid gap-3 md:grid-cols-2">
      <p v-t="'internships.internshipApplication.applyCard.description'" />
      <FormKit
        v-model="formValues"
        :disabled="loading"
        type="form"
        :submit-label="
          $t('internships.internshipApplication.applyCard.action.submit')
        "
        @submit="handleFormSubmit"
      >
        <FormKit
          :label="$t('internships.internshipApplication.field.priority.label')"
          :placeholder="
            $t('internships.internshipApplication.field.priority.placeholder')
          "
          name="priority"
          :options="priorityOptions"
          type="select"
          validation="required"
        />
      </FormKit>
    </div>
  </UiNotification>
</template>