<script lang="ts" setup>
import { FormKitNode } from '@formkit/core';

import { graphql } from '~/codegen';

const { t } = useI18n();

const router = useRouter();

const CreateCompetencyFrameworkDocument = graphql(`
	mutation CreateCompetencyFramework($data: CreateCompetencyFrameworkInput!) {
		createCompetencyFramework(data: $data) {
			... on MutationCreateCompetencyFrameworkSuccess {
				data {
					id
				}
			}
			...UserErrorFragment
		}
	}
`);

const { mutate: createCompetencyFramework } = useMutation(
	CreateCompetencyFrameworkDocument,
);

const formErrors = ref<string[]>([]);
const formNode = ref<FormKitNode>();
const formValues = ref<{ title: string }>({ title: '' });

async function handleFormSubmit(): Promise<void> {
	formErrors.value = [];
	try {
		const response = await createCompetencyFramework({
			data: { title: formValues.value.title },
		});
		switch (response?.data?.createCompetencyFramework.__typename) {
			default:
				console.error(
					'unexpected mutation response',
					response?.data?.createCompetencyFramework,
				);
				formErrors.value.push(
					t('management.competencyFramework.create.error.internal'),
				);
				return;
			case 'InputError': {
				const mutationError = response.data.createCompetencyFramework;
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
			case 'MutationCreateCompetencyFrameworkSuccess':
				router.push('/manage/competencies');
				break;
		}
	} catch (error) {
		console.error('crash during execution', error);
		formErrors.value.push(
			t('management.competencyFramework.create.error.internal'),
		);
	}
}
</script>

<template>
	<UiCard class="p-5">
		<FormKit
			v-model="formValues"
			type="form"
			:submit-label="$t('management.competencyFramework.create.submitButton')"
			:errors="formErrors"
			@node="formNode = $event"
			@submit="handleFormSubmit"
		>
			<FormKit
				name="title"
				:label="t('management.competencyFramework.field.name')"
				type="text"
				validation="required"
			/>
		</FormKit>
	</UiCard>
</template>
