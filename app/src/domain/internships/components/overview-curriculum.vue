<script lang="ts" setup>
import { InternshipOverviewCurriculumQueryDocument } from '~/codegen/graphql.js';
import { useGlobalStore } from '~/domain/global/store.js';

const props = defineProps<{
	instanceId: string; // route param
}>();

const globalStore = useGlobalStore();

gql`
	query InternshipOverviewCurriculumQuery($id: ID!) {
		internshipInstance(id: $id) {
			id
			internship {
				id
				coordinator {
					name
				}
				course {
					name
				}
				education {
					title
				}
			}
			supervisors {
				id
				name
			}
		}
	}
`;

const { onError, result } = useQuery(
	InternshipOverviewCurriculumQueryDocument,
	() => ({
		id: props.instanceId,
	}),
	{ fetchPolicy: 'cache-first' },
);
onError(globalStore.handleFatalApolloError);

const internshipInstance = computed(() => result.value?.internshipInstance);
</script>

<template>
	<UiCard class="py-3 px-5">
		<UiTitle is="h3" class="text-lg mb-3">Curiculum</UiTitle>
		<dl v-if="internshipInstance" class="grid gap-2">
			<dt>Education</dt>
			<dd>{{ internshipInstance.internship.education.title }}</dd>
			<dt>Course</dt>
			<dd>{{ internshipInstance.internship.course.name }}</dd>
			<dt>Coordinator</dt>
			<dd>{{ internshipInstance.internship.coordinator.name }}</dd>
			<div
				v-for="supervisor in internshipInstance.supervisors"
				:key="supervisor.id"
				class="contents"
			>
				<dt>Supervisor</dt>
				<dd>{{ supervisor.name }}</dd>
			</div>
		</dl>
	</UiCard>
</template>

<style scoped>
.grid {
	grid-template-columns: 1fr 1fr;
}
.grid dt {
	@apply font-bold;
}
</style>
