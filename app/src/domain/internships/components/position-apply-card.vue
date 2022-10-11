<script lang="ts" setup>
import { ApplyForInternshipMutationDocument } from '~/codegen/graphql';
import { assert } from '~/utils';

const props = defineProps<{
	instanceId: string;
	positionId: string;
}>();

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
			instance {
				id
				appliedForPosition(id: $positionId)
			}
		}
	}
`;

interface FormValues {
	priority?: number;
}
const formValues = ref<FormValues>({});

const priorityOptions = [1, 2, 3]; // eslint-disable-line @typescript-eslint/no-magic-numbers

const { loading, mutate } = useMutation(ApplyForInternshipMutationDocument);

async function handleFormSubmit(): Promise<void> {
	const { priority } = formValues.value;
	assert(priority);
	try {
		await mutate({ ...props, priority });
	} catch (error) {
		console.error('could not apply for internship position', error);
	}
}
</script>

<template>
	<UiNotification
		color="info"
		:heading="$t('internships.internshipApplication.applyCard.heading')"
	>
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
